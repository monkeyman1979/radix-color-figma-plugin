# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin that imports Radix Colors (from `@radix-ui/colors`) as Figma color variables. The plugin allows users to select specific colors and variants (light/dark, with/without alpha) and import them into new or existing variable collections.

## Build Commands

```bash
npm run build   # Build the plugin for production
npm run watch   # Build and watch for changes (note: watch mode is defined but not yet implemented)
```

After building, reload the plugin in Figma to see changes.

## Architecture

This is a standard Figma plugin with a **two-process architecture**:

### 1. Main Thread (`src/code.ts`)
- Runs in Figma's plugin sandbox with access to the Figma API
- Compiled to `dist/code.js` (platform: node)
- Handles:
  - Creating/selecting variable collections via `figma.variables` API
  - Creating color variables with 12-step scales
  - Updating existing variables if re-imported
  - Communication with UI via `figma.ui.onmessage` and `figma.ui.postMessage`

### 2. UI Thread (`src/ui.ts` + `src/ui.html`)
- Runs in an iframe as a browser environment
- Compiled to `dist/ui.js` (platform: browser) and `dist/ui.html`
- Handles:
  - User interface for color/variant selection
  - Collection selection (new or existing)
  - Communication with main thread via `parent.postMessage` and `window.onmessage`

### Communication Protocol (`src/types.ts`)

Messages flow between the two threads using typed message objects:

**UI → Main:**
- `GetCollectionsMessage`: Request list of existing collections
- `ImportMessage`: Trigger import with selected colors/variants

**Main → UI:**
- `CollectionsResponseMessage`: Return available collections

## Key Implementation Details

### Color Import Process

1. **Color naming in Radix**: Each color (e.g., "blue") has 4 variants:
   - `blue`: light mode solid (12 steps: blue1-blue12)
   - `blueA`: light mode alpha (12 steps: blueA1-blueA12)
   - `blueDark`: dark mode solid (12 steps: blueDark1-blueDark12)
   - `blueDarkA`: dark mode alpha (12 steps: blueDarkA1-blueDarkA12)

2. **Variable naming in Figma**: Variables use "/" for grouping:
   ```
   blue / light / 1
   blue / light / 2
   ...
   blue / dark alpha / 12
   ```

3. **Color conversion**: Radix colors are hex strings (e.g., "#0090FF") that must be converted to Figma's RGB format `{r: 0-1, g: 0-1, b: 0-1}`. This is handled in `src/utils/color-utils.ts`.

4. **Update vs. Create**: The plugin checks if a variable with the same name exists in the collection. If it does, it updates the value; otherwise, it creates a new variable.

### Build Process

The esbuild config (`esbuild.config.js`) performs three operations:
1. Bundle `src/code.ts` → `dist/code.js` (node platform)
2. Bundle `src/ui.ts` → `dist/ui.js` (browser platform)
3. Copy `src/ui.html` → `dist/ui.html` and replace `<script src="ui.ts">` with `<script src="ui.js">`

The `manifest.json` points to the built files in `dist/`.

## Testing the Plugin

1. Build: `npm run build`
2. In Figma Desktop: **Plugins** → **Development** → **Import plugin from manifest**
3. Select `manifest.json` from this directory
4. Run: **Plugins** → **Development** → **Radix Colors Importer**

After making changes, run `npm run build` and reload the plugin in Figma (right-click → Reload).

## Radix Colors Integration

- All 30+ Radix colors are defined in `src/utils/radix-data.ts` with metadata (name, display name, category, preview color)
- The actual color values come from the bundled `@radix-ui/colors` package
- Colors are accessed at runtime: `import * as radixColors from '@radix-ui/colors'` then `radixColors.blue.blue1`

## Important Constraints

- The plugin has `networkAccess: { allowedDomains: ["none"] }` - it works completely offline
- Figma color variables require RGB values in 0-1 range, not 0-255
- Variables must be created within a collection and assigned to a mode
- The plugin uses a single mode (the first mode of the collection) for all imported colors
