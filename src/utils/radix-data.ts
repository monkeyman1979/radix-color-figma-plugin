import type { RadixColorInfo } from '../types';

/**
 * All Radix Colors organized by category
 * Preview colors are approximate middle-range colors for display purposes
 */
export const RADIX_COLORS: RadixColorInfo[] = [
  // Neutrals
  { name: 'gray', displayName: 'Gray', category: 'Neutral', previewColor: '#8B8D98' },
  { name: 'mauve', displayName: 'Mauve', category: 'Neutral', previewColor: '#8E8C99' },
  { name: 'slate', displayName: 'Slate', category: 'Neutral', previewColor: '#889096' },
  { name: 'sage', displayName: 'Sage', category: 'Neutral', previewColor: '#868E8B' },
  { name: 'olive', displayName: 'Olive', category: 'Neutral', previewColor: '#898E87' },
  { name: 'sand', displayName: 'Sand', category: 'Neutral', previewColor: '#8B8A86' },

  // Metallics & Earth Tones
  { name: 'gold', displayName: 'Gold', category: 'Metallic', previewColor: '#978365' },
  { name: 'bronze', displayName: 'Bronze', category: 'Metallic', previewColor: '#957468' },
  { name: 'brown', displayName: 'Brown', category: 'Metallic', previewColor: '#AD7F58' },

  // Warm Colors
  { name: 'yellow', displayName: 'Yellow', category: 'Warm', previewColor: '#F5D90A' },
  { name: 'amber', displayName: 'Amber', category: 'Warm', previewColor: '#FFB224' },
  { name: 'orange', displayName: 'Orange', category: 'Warm', previewColor: '#F76B15' },
  { name: 'tomato', displayName: 'Tomato', category: 'Warm', previewColor: '#E54D2E' },
  { name: 'red', displayName: 'Red', category: 'Warm', previewColor: '#E5484D' },
  { name: 'ruby', displayName: 'Ruby', category: 'Warm', previewColor: '#E54666' },
  { name: 'crimson', displayName: 'Crimson', category: 'Warm', previewColor: '#E93D82' },
  { name: 'pink', displayName: 'Pink', category: 'Warm', previewColor: '#D6409F' },

  // Cool Colors
  { name: 'plum', displayName: 'Plum', category: 'Cool', previewColor: '#AB4ABA' },
  { name: 'purple', displayName: 'Purple', category: 'Cool', previewColor: '#8E4EC6' },
  { name: 'violet', displayName: 'Violet', category: 'Cool', previewColor: '#6E56CF' },
  { name: 'iris', displayName: 'Iris', category: 'Cool', previewColor: '#5B5BD6' },
  { name: 'indigo', displayName: 'Indigo', category: 'Cool', previewColor: '#3E63DD' },
  { name: 'blue', displayName: 'Blue', category: 'Cool', previewColor: '#0090FF' },
  { name: 'cyan', displayName: 'Cyan', category: 'Cool', previewColor: '#00A2C7' },
  { name: 'teal', displayName: 'Teal', category: 'Cool', previewColor: '#12A594' },

  // Greens
  { name: 'jade', displayName: 'Jade', category: 'Green', previewColor: '#29A383' },
  { name: 'green', displayName: 'Green', category: 'Green', previewColor: '#46A758' },
  { name: 'grass', displayName: 'Grass', category: 'Green', previewColor: '#46A758' },
  { name: 'lime', displayName: 'Lime', category: 'Green', previewColor: '#99D52A' },
  { name: 'mint', displayName: 'Mint', category: 'Green', previewColor: '#4DC399' },
  { name: 'sky', displayName: 'Sky', category: 'Green', previewColor: '#7CE2FE' },

  // Special
  { name: 'blackA', displayName: 'Black Alpha', category: 'Special', previewColor: '#00000066' },
  { name: 'whiteA', displayName: 'White Alpha', category: 'Special', previewColor: '#FFFFFF66' },
];

/**
 * Get colors grouped by category
 */
export function getColorsByCategory(): Record<string, RadixColorInfo[]> {
  const grouped: Record<string, RadixColorInfo[]> = {};

  for (const color of RADIX_COLORS) {
    if (!grouped[color.category]) {
      grouped[color.category] = [];
    }
    grouped[color.category].push(color);
  }

  return grouped;
}

/**
 * Get the import names for a color based on selected variants
 */
export function getColorImportNames(colorName: string, variants: {
  light: boolean;
  lightAlpha: boolean;
  dark: boolean;
  darkAlpha: boolean;
}): string[] {
  const imports: string[] = [];

  if (variants.light) {
    imports.push(colorName);
  }
  if (variants.lightAlpha) {
    imports.push(`${colorName}A`);
  }
  if (variants.dark) {
    imports.push(`${colorName}Dark`);
  }
  if (variants.darkAlpha) {
    imports.push(`${colorName}DarkA`);
  }

  return imports;
}
