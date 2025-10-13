# Radix Colors Figma Plugin

Import [Radix Colors](https://www.radix-ui.com/colors) into Figma as color variables with full control over which colors and variants to include.

## Features

- Import any of the 30+ Radix color scales
- Choose which variants to import:
  - Light (solid colors)
  - Light Alpha (transparent)
  - Dark (solid colors)
  - Dark Alpha (transparent)
- Create a new collection or add to an existing one
- Updates existing variables if they already exist
- Full 12-step color scale for each color

## Installation

### Option 1: Import from Manifest (Development)

1. Open Figma Desktop
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Navigate to this directory and select `manifest.json`

### Option 2: Publish to Figma Community (Later)

You can publish this plugin to the Figma Community to share with others.

## Usage

1. Open a Figma file
2. Run the plugin: **Plugins** → **Development** → **Radix Colors Importer**

3. **Step 1: Choose Collection**
   - Create a new collection (e.g., "Primitive Color")
   - Or select an existing collection to add colors to

4. **Step 2: Select Colors**
   - Choose which Radix colors you want to import
   - Colors are organized by category (Neutral, Warm, Cool, etc.)
   - Use "Select All" / "Deselect All" for quick selection

5. **Step 3: Select Variants**
   - Choose which color variants to import:
     - **Light**: Solid colors for light mode (e.g., `blue1` - `blue12`)
     - **Light Alpha**: Transparent colors for light mode (e.g., `blueA1` - `blueA12`)
     - **Dark**: Solid colors for dark mode
     - **Dark Alpha**: Transparent colors for dark mode

6. Click **Import Colors**

## Variable Structure

Variables are created with the following naming structure:

```
Collection Name
├─ blue / light / 1
├─ blue / light / 2
├─ ...
├─ blue / light / 12
├─ blue / light alpha / 1
├─ ...
├─ blue / dark / 1
├─ ...
└─ blue / dark alpha / 12
```

After importing, you can rename the color groups to match your design system:
- Rename `blue` → `primary`
- Rename `tomato` → `error`
- Rename `gray` → `neutral`

## Development

### Project Structure

```
radix-color-figma-plugin/
├── manifest.json          # Figma plugin manifest
├── package.json           # Dependencies
├── esbuild.config.js      # Build configuration
├── src/
│   ├── code.ts           # Main plugin logic
│   ├── ui.html           # Plugin UI
│   ├── ui.ts             # UI logic
│   ├── types.ts          # TypeScript types
│   └── utils/
│       ├── radix-data.ts # Radix color metadata
│       └── color-utils.ts # Color conversion utilities
└── dist/                  # Built files
```

### Build Commands

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch mode (for development)
npm run watch
```

### Making Changes

1. Edit source files in `src/`
2. Run `npm run build`
3. Reload the plugin in Figma

## Available Colors

### Neutrals
Gray, Mauve, Slate, Sage, Olive, Sand

### Metallics
Gold, Bronze, Brown

### Warm
Yellow, Amber, Orange, Tomato, Red, Ruby, Crimson, Pink

### Cool
Plum, Purple, Violet, Iris, Indigo, Blue, Cyan, Teal

### Greens
Jade, Green, Grass, Lime, Mint, Sky

### Special
Black Alpha, White Alpha

## License

MIT

## Credits

Built with [Radix Colors](https://www.radix-ui.com/colors) by Radix UI.
