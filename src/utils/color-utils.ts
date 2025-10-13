/**
 * Converts a hex color string to Figma's RGBA format (0-1 range)
 * Supports #RGB, #RRGGBB, and #RRGGBBAA formats
 */
export function hexToFigmaRGB(hex: string): RGBA {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle 3-character hex codes (e.g., #FFF)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Check for alpha channel (8-character hex like #RRGGBBAA)
  let a = 1;
  if (hex.length === 8) {
    a = parseInt(hex.substring(6, 8), 16) / 255;
  }

  return { r, g, b, a };
}

/**
 * Parses color strings from Radix (which can be hex or rgba)
 * Returns RGBA values in Figma format (0-1)
 */
export function parseRadixColor(colorString: string): RGBA {
  // If it's a hex color
  if (colorString.startsWith('#')) {
    return hexToFigmaRGB(colorString);
  }

  // If it's an rgba color
  if (colorString.startsWith('rgba')) {
    const matches = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (matches) {
      return {
        r: parseInt(matches[1]) / 255,
        g: parseInt(matches[2]) / 255,
        b: parseInt(matches[3]) / 255,
        a: matches[4] ? parseFloat(matches[4]) : 1,
      };
    }
  }

  // If it's an hsl color (convert to RGB)
  if (colorString.startsWith('hsl')) {
    const matches = colorString.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)/);
    if (matches) {
      const h = parseInt(matches[1]) / 360;
      const s = parseFloat(matches[2]) / 100;
      const l = parseFloat(matches[3]) / 100;
      const a = matches[4] ? parseFloat(matches[4]) : 1;
      const rgb = hslToRgb(h, s, l);
      return { r: rgb.r, g: rgb.g, b: rgb.b, a };
    }
  }

  // Fallback: return black
  console.warn(`Could not parse color: ${colorString}`);
  return { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * Converts HSL to RGB (Figma format, 0-1 range)
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r, g, b };
}
