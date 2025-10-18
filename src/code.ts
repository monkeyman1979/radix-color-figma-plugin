import * as radixColors from '@radix-ui/colors';
import { parseRadixColor } from './utils/color-utils';
import type { PluginMessage, ImportMessage } from './types';

// Show the plugin UI
figma.showUI(__html__, {
  width: 500,
  height: 720,
  themeColors: true,
});

// Handle messages from the UI
figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'get-collections') {
    await handleGetCollections();
  } else if (msg.type === 'import') {
    await handleImport(msg);
  } else if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
  }
};

/**
 * Get all existing variable collections and send to UI
 */
async function handleGetCollections() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  figma.ui.postMessage({
    type: 'collections-response',
    collections: collections.map(c => ({
      id: c.id,
      name: c.name,
    })),
  });
}

/**
 * Main import logic
 */
async function handleImport(msg: ImportMessage) {
  try {
    // Get or create collection
    let collection: VariableCollection;

    if (msg.collectionMode === 'new') {
      collection = figma.variables.createVariableCollection(msg.collectionName || 'Radix Colors');
    } else {
      const collections = await figma.variables.getLocalVariableCollectionsAsync();
      const found = collections.find(c => c.id === msg.collectionId);
      if (!found) {
        figma.notify('Collection not found', { error: true });
        return;
      }
      collection = found;
    }

    const modeId = collection.modes[0].modeId;
    let createdCount = 0;
    let updatedCount = 0;

    // Process each selected color
    for (const colorName of msg.selectedColors) {
      // Determine which variants to import
      const variantsToImport: Array<{
        importName: string;
        groupName: string;
      }> = [];

      if (msg.variants.light) {
        variantsToImport.push({
          importName: colorName,
          groupName: 'light',
        });
      }

      if (msg.variants.lightAlpha) {
        variantsToImport.push({
          importName: `${colorName}A`,
          groupName: 'light alpha',
        });
      }

      if (msg.variants.dark) {
        variantsToImport.push({
          importName: `${colorName}Dark`,
          groupName: 'dark',
        });
      }

      if (msg.variants.darkAlpha) {
        variantsToImport.push({
          importName: `${colorName}DarkA`,
          groupName: 'dark alpha',
        });
      }

      // Import each variant
      for (const variant of variantsToImport) {
        const radixColorData = (radixColors as any)[variant.importName];

        if (!radixColorData) {
          console.warn(`Color ${variant.importName} not found in @radix-ui/colors`);
          continue;
        }

        // Create variables for each step (1-12)
        for (let step = 1; step <= 12; step++) {
          // Determine the correct key for Radix Colors object
          // - blue -> blue1
          // - blueA -> blueA1
          // - blueDark -> blue1 (strip Dark)
          // - blueDarkA -> blueA1 (strip Dark, keep A)
          let colorKey: string;
          if (variant.importName.includes('Dark')) {
            // Remove 'Dark' but keep 'A' if present
            colorKey = `${colorName}${variant.importName.includes('A') ? 'A' : ''}${step}`;
          } else {
            // Base or alpha color - use as is
            colorKey = `${variant.importName}${step}`;
          }

          const colorValue = radixColorData[colorKey];

          if (!colorValue) {
            console.warn(`Color value not found: ${colorKey}`);
            continue;
          }

          // Parse the color
          const rgbColor = parseRadixColor(colorValue);

          // Create variable name with grouping
          const variableName = `${colorName} / ${variant.groupName} / ${step}`;

          // Check if variable already exists
          const existingVariables = await figma.variables.getLocalVariablesAsync();
          const existingVar = existingVariables.find(
            v => v.name === variableName && v.variableCollectionId === collection.id
          );

          if (existingVar && existingVar.resolvedType === 'COLOR') {
            // Update existing variable
            existingVar.setValueForMode(modeId, rgbColor);
            updatedCount++;
          } else {
            // Create new variable
            const newVar = figma.variables.createVariable(
              variableName,
              collection,
              'COLOR'
            );
            newVar.setValueForMode(modeId, rgbColor);
            createdCount++;
          }
        }
      }
    }

    // Show success message
    const message = `Import complete! Created ${createdCount} variables, updated ${updatedCount} variables.`;
    figma.notify(message);
    figma.closePlugin();
  } catch (error) {
    console.error('Import error:', error);
    figma.notify(`Error: ${error}`, { error: true });
  }
}
