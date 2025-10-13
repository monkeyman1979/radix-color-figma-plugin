import { RADIX_COLORS, getColorsByCategory } from './utils/radix-data';
import type { ImportMessage, UIMessage } from './types';

// Hide the "JavaScript not loaded" warning immediately
const jsCheck = document.getElementById('jsCheck');
if (jsCheck) {
  jsCheck.textContent = '✓ JavaScript loaded successfully!';
  jsCheck.style.background = '#d4edda';
  jsCheck.style.color = '#155724';
  setTimeout(() => jsCheck.remove(), 2000);
}

// DOM elements
const collectionModeRadios = document.querySelectorAll<HTMLInputElement>('input[name="collectionMode"]');
const collectionNameInput = document.getElementById('collectionName') as HTMLInputElement;
const existingCollectionRadio = document.getElementById('existingCollectionRadio') as HTMLInputElement;
const existingCollectionLabel = document.getElementById('existingCollectionLabel') as HTMLLabelElement;
const existingCollectionSelect = document.getElementById('existingCollection') as HTMLSelectElement;
const colorGrid = document.getElementById('colorGrid') as HTMLDivElement;
const colorCounter = document.getElementById('colorCounter') as HTMLDivElement;
const debugInfo = document.getElementById('debugInfo') as HTMLDivElement;
const selectAllButton = document.getElementById('selectAll') as HTMLButtonElement;
const deselectAllButton = document.getElementById('deselectAll') as HTMLButtonElement;
const variantCheckboxes = document.querySelectorAll<HTMLInputElement>('input[name="variant"]');
const importButton = document.getElementById('importButton') as HTMLButtonElement;
const variantError = document.getElementById('variantError') as HTMLDivElement;
const importError = document.getElementById('importError') as HTMLDivElement;

// State
let collections: Array<{ id: string; name: string }> = [];

// Initialize
init();

function init() {
  // Request existing collections from plugin
  parent.postMessage({ pluginMessage: { type: 'get-collections' } }, '*');

  // Render color grid
  renderColorGrid();

  // Setup event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Collection mode radio buttons
  collectionModeRadios.forEach(radio => {
    radio.addEventListener('change', handleCollectionModeChange);
  });

  // Select/Deselect all buttons
  selectAllButton.addEventListener('click', () => {
    const checkboxes = colorGrid.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    updateColorCounter();
  });

  deselectAllButton.addEventListener('click', () => {
    const checkboxes = colorGrid.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateColorCounter();
  });

  // Import button
  importButton.addEventListener('click', handleImport);

  // Listen for messages from plugin
  window.onmessage = (event) => {
    const msg = event.data.pluginMessage as UIMessage;
    if (msg.type === 'collections-response') {
      handleCollectionsResponse(msg.collections);
    }
  };
}

function handleCollectionModeChange() {
  const mode = (document.querySelector<HTMLInputElement>('input[name="collectionMode"]:checked'))?.value;

  if (mode === 'new') {
    collectionNameInput.disabled = false;
    existingCollectionSelect.disabled = true;
  } else {
    collectionNameInput.disabled = true;
    existingCollectionSelect.disabled = false;
  }
}

function updateColorCounter() {
  const selectedColors = getSelectedColors();
  const totalColors = colorGrid.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').length;

  if (colorCounter) {
    colorCounter.textContent = `${selectedColors.length} of ${totalColors} colors selected`;
  }

  // Update import button text and state
  if (selectedColors.length > 0) {
    importButton.textContent = `Import ${selectedColors.length} color${selectedColors.length === 1 ? '' : 's'}`;
    importButton.disabled = false;
  } else {
    importButton.textContent = 'Import Colors';
    importButton.disabled = true;
  }
}

function handleCollectionsResponse(receivedCollections: Array<{ id: string; name: string }>) {
  collections = receivedCollections;

  // Update select dropdown
  existingCollectionSelect.innerHTML = '';

  if (collections.length === 0) {
    // No collections - disable the radio button option
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No collections found';
    existingCollectionSelect.appendChild(option);

    // Disable the "Use existing collection" radio button
    existingCollectionRadio.disabled = true;
    existingCollectionLabel.classList.add('disabled');
  } else {
    // Collections exist - enable the radio button option
    collections.forEach(collection => {
      const option = document.createElement('option');
      option.value = collection.id;
      option.textContent = collection.name;
      existingCollectionSelect.appendChild(option);
    });

    // Enable the "Use existing collection" radio button
    existingCollectionRadio.disabled = false;
    existingCollectionLabel.classList.remove('disabled');
  }
}

function renderColorGrid() {
  console.log('renderColorGrid called');
  console.log('colorGrid element:', colorGrid);

  // Show debug info in UI
  if (debugInfo) {
    debugInfo.style.display = 'block';
    debugInfo.textContent = 'Debug: renderColorGrid called';
  }

  if (!colorGrid) {
    console.error('colorGrid element not found!');
    if (debugInfo) {
      debugInfo.textContent = 'ERROR: colorGrid element not found!';
      debugInfo.style.background = '#f8d7da';
      debugInfo.style.color = '#721c24';
    }
    return;
  }

  const colorsByCategory = getColorsByCategory();
  console.log('colorsByCategory:', colorsByCategory);

  const categoryCount = Object.keys(colorsByCategory).length;
  if (debugInfo) {
    debugInfo.textContent = `Debug: Found ${categoryCount} categories. Rendering...`;
  }

  colorGrid.innerHTML = '';

  let totalColorsRendered = 0;
  for (const [category, colors] of Object.entries(colorsByCategory)) {
    console.log(`Rendering category: ${category} with ${colors.length} colors`);
    totalColorsRendered += colors.length;

    // Add category header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.textContent = category;
    colorGrid.appendChild(header);

    // Add colors in this category
    colors.forEach(color => {
      const colorItem = document.createElement('div');
      colorItem.className = 'color-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = color.name;
      checkbox.id = `color-${color.name}`;
      checkbox.addEventListener('change', updateColorCounter);

      const preview = document.createElement('div');
      preview.className = 'color-preview';
      preview.style.backgroundColor = color.previewColor;

      const label = document.createElement('label');
      label.htmlFor = `color-${color.name}`;
      label.textContent = color.displayName;
      label.style.cursor = 'pointer';

      colorItem.appendChild(checkbox);
      colorItem.appendChild(preview);
      colorItem.appendChild(label);

      colorGrid.appendChild(colorItem);
    });
  }

  // Update debug info with success message
  if (debugInfo) {
    debugInfo.textContent = `✓ Rendered ${totalColorsRendered} colors in ${categoryCount} categories`;
    debugInfo.style.background = '#d4edda';
    debugInfo.style.color = '#155724';

    // Hide debug info after 3 seconds
    setTimeout(() => {
      debugInfo.style.display = 'none';
    }, 3000);
  }

  // Initialize color counter
  updateColorCounter();
}

function handleImport() {
  // Validate: at least one color selected
  const selectedColors = getSelectedColors();
  if (selectedColors.length === 0) {
    importError.textContent = 'Please select at least one color';
    importError.style.display = 'block';
    return;
  }

  // Validate: at least one variant selected
  const variants = getSelectedVariants();
  if (!variants.light && !variants.lightAlpha && !variants.dark && !variants.darkAlpha) {
    variantError.style.display = 'block';
    importError.style.display = 'none';
    return;
  }

  variantError.style.display = 'none';
  importError.style.display = 'none';

  // Get collection info
  const collectionMode = (document.querySelector<HTMLInputElement>('input[name="collectionMode"]:checked'))?.value as 'new' | 'existing';

  let collectionName: string | undefined;
  let collectionId: string | undefined;

  if (collectionMode === 'new') {
    collectionName = collectionNameInput.value.trim() || 'Radix Colors';
  } else {
    collectionId = existingCollectionSelect.value;
    if (!collectionId) {
      importError.textContent = 'Please select a collection';
      importError.style.display = 'block';
      return;
    }
  }

  // Send import message to plugin
  const message: ImportMessage = {
    type: 'import',
    collectionMode,
    collectionName,
    collectionId,
    selectedColors,
    variants,
  };

  parent.postMessage({ pluginMessage: message }, '*');

  // Disable button while importing
  importButton.disabled = true;
  importButton.textContent = 'Importing...';
}

function getSelectedColors(): string[] {
  const checkboxes = colorGrid.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function getSelectedVariants() {
  return {
    light: (document.querySelector<HTMLInputElement>('input[value="light"]'))?.checked || false,
    lightAlpha: (document.querySelector<HTMLInputElement>('input[value="lightAlpha"]'))?.checked || false,
    dark: (document.querySelector<HTMLInputElement>('input[value="dark"]'))?.checked || false,
    darkAlpha: (document.querySelector<HTMLInputElement>('input[value="darkAlpha"]'))?.checked || false,
  };
}
