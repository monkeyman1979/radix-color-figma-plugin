const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const watch = process.argv.includes('--watch');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

async function build() {
  try {
    // Build main plugin code
    await esbuild.build({
      entryPoints: ['src/code.ts'],
      bundle: true,
      outfile: 'dist/code.js',
      platform: 'node',
      target: 'es2020',
    });
    console.log('✓ Built dist/code.js');

    // Build UI code
    await esbuild.build({
      entryPoints: ['src/ui.ts'],
      bundle: true,
      outfile: 'dist/ui.js',
      platform: 'browser',
      target: 'es2020',
    });
    console.log('✓ Built dist/ui.js');

    // Read the HTML and JS files
    const htmlContent = fs.readFileSync('src/ui.html', 'utf8');
    const jsContent = fs.readFileSync('dist/ui.js', 'utf8');

    // Inline the JavaScript into the HTML
    const processedHtml = htmlContent.replace(
      '<script src="ui.ts"></script>',
      `<script>${jsContent}</script>`
    );
    fs.writeFileSync('dist/ui.html', processedHtml);
    console.log('✓ Inlined JavaScript into ui.html');

    console.log('\n✅ Build complete!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
