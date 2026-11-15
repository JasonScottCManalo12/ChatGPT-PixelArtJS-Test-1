(function (root) {
  "use strict";

  const clampByte = value => Math.max(0, Math.min(255, Math.round(value)));

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let rgb;
    if (h < 60) rgb = [c, x, 0];
    else if (h < 120) rgb = [x, c, 0];
    else if (h < 180) rgb = [0, c, x];
    else if (h < 240) rgb = [0, x, c];
    else if (h < 300) rgb = [x, 0, c];
    else rgb = [c, 0, x];
    return rgb.map(channel => clampByte((channel + m) * 255));
  }

  // Every generator accepts a zero-based sequence index and returns [R, G, B].
  // Their internal formulas are intentionally independent.
  const generators = {
    blackWhite(index) {
      const value = index % 2 === 0 ? 0 : 255;
      return [value, value, value];
    },
    grayscale(index) {
      const value = index % 256;
      return [value, value, value];
    },
    rgb(index) {
      const n = index % 16777216;
      return [(n >>> 16) & 255, (n >>> 8) & 255, n & 255];
    },
    coffeeblake(index) {
      // Illustrative warm-tone ramp for this prototype; not claimed to reproduce
      // the historical Coffeeblake formula from the original PixelArtJS.
      const t = (index % 256) / 255;
      return [clampByte(42 + 150 * t), clampByte(24 + 105 * t), clampByte(12 + 62 * t)];
    },
    hsl(index) {
      return hslToRgb(index % 360, 100, 50);
    },
    rubik(index) {
      const palette = [
        [255, 255, 255], [255, 213, 0], [183, 18, 52],
        [255, 88, 0], [0, 155, 72], [0, 70, 173]
      ];
      return palette[index % palette.length].slice();
    },
    allColors(index) {
      const n = index % 16777216;
      return [Math.floor(n / 65536), Math.floor(n / 256) % 256, n % 256];
    }
  };

  function generateGrid(options) {
    const width = Number(options.width);
    const height = Number(options.height);
    const mode = options.mode;
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 128 || height > 128) {
      throw new RangeError("Width and height must be whole numbers from 1 to 128.");
    }
    if (!Object.prototype.hasOwnProperty.call(generators, mode)) {
      throw new RangeError("Unknown color category: " + mode);
    }

    const pixels = new Uint8ClampedArray(width * height * 4);
    const getColor = generators[mode];

    // Shared principle: sequence index -> category color -> pixel coordinate -> RGBA.
    for (let index = 0; index < width * height; index += 1) {
      const color = getColor(index);
      const x = index % width;
      const y = Math.floor(index / width);
      const pixelOffset = (y * width + x) * 4;
      pixels[pixelOffset] = clampByte(color[0]);
      pixels[pixelOffset + 1] = clampByte(color[1]);
      pixels[pixelOffset + 2] = clampByte(color[2]);
      pixels[pixelOffset + 3] = 255;
    }
    return { width, height, mode, pixels };
  }

  const api = { generators, generateGrid, hslToRgb };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PixelArtColorEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this);