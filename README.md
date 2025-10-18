# Radix Colors Figma Plugin

Import [Radix Colors](https://www.radix-ui.com/colors) into Figma as color variables with full control over which colors and variants to include.

## Features

- ✨ Import any of the 33 Radix color scales
- 🎨 Choose which variants to import:
  - Light (solid colors)
  - Light Alpha (transparent)
  - Dark (solid colors)
  - Dark Alpha (transparent)
- 📦 Create a new collection or add to an existing one
- 🔄 Updates existing variables if they already exist
- 📊 Full 12-step color scale for each color
- 🌓 Theme-aware UI (adapts to Figma's light/dark mode)
- 🎯 Real-time color counter and smart button validation
- ⚡ Select All / Deselect All for quick workflows

## Installation

### For Users (Coming Soon)

This plugin will be available on the Figma Community. Stay tuned!

### For Testers & Contributors

Want to test the plugin before it's published? Follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/monkeyman1979/radix-color-figma-plugin.git
   cd radix-color-figma-plugin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the plugin**
   ```bash
   npm run build
   ```
   This creates the `dist/` folder with the compiled plugin files.

4. **Import into Figma Desktop**
   - Open Figma Desktop (plugin development requires desktop app)
   - Go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
   - Navigate to the cloned folder and select `manifest.json`
   - Click **Open**

5. **Run the plugin**
   - Right-click anywhere in your Figma file
   - Go to **Plugins** → **Development** → **Radix Colors Importer (Developer VM)**

**Note:** You need Node.js installed to build the plugin. The `dist/` folder is gitignored, so building is required after cloning.

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
2. Run `npm run build` (or `npm run watch` for automatic rebuilds)
3. In Figma, right-click → **Plugins** → **Development** → **Reload plugin**

## Contributing

Contributions are welcome! This project uses a two-branch workflow:

- **`main`** - Stable, production-ready code
- **`develop`** - Active development branch

### Contribution Workflow

1. Fork the repository
2. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and test thoroughly
4. Commit with clear, descriptive messages
5. Push to your fork
6. Open a Pull Request to the `develop` branch

### Branch Protection

Both `main` and `develop` branches are protected:
- All changes must go through Pull Requests
- This ensures code quality and allows for review

### Development Tips

- Use `npm run watch` during development for automatic rebuilds
- Test in both light and dark Figma themes
- Verify all color variants import correctly (Light, Light Alpha, Dark, Dark Alpha)
- Check that the import button validation works (disabled until colors are selected)

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

## Troubleshooting

### Plugin not showing up in Figma
- Make sure you're using **Figma Desktop**, not the browser version
- Verify you imported the plugin via **Plugins → Development → Import plugin from manifest**
- Check that you selected the correct `manifest.json` file

### Colors not importing
- Ensure at least one color is selected (button is disabled until selection)
- Verify at least one variant is selected (Light, Light Alpha, Dark, or Dark Alpha)
- Check the browser console in Figma for error messages

### Build errors
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Try clearing the build cache: `rm -rf dist && npm run build`

### Alpha colors appear solid
- This has been fixed in the current version
- Make sure you've pulled the latest code and rebuilt: `git pull && npm run build`
- Reload the plugin in Figma after rebuilding

## Technology Stack

- **TypeScript** - Type-safe development
- **esbuild** - Fast bundling and compilation
- **Figma Plugin API** - Variable collections and color management
- **@radix-ui/colors** - Official Radix Colors package

## License

MIT - See [LICENSE](LICENSE) file for details

## Credits

- **Radix Colors** by [Radix UI](https://www.radix-ui.com/colors) - The comprehensive color system that powers this plugin
- Plugin developed with ❤️ for the design community

## Links

- [GitHub Repository](https://github.com/monkeyman1979/radix-color-figma-plugin)
- [Radix Colors Documentation](https://www.radix-ui.com/colors/docs/overview/getting-started)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)

---

**Found this plugin helpful?** Star the repo on GitHub and share it with your design team!
