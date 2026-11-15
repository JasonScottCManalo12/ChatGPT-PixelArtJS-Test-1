"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { inflateSync } = require("node:zlib");

const root = path.resolve(__dirname, "../../test-artifacts/export-verification");
const fixtures = [
  { rows: 1, columns: 1 },
  { rows: 3, columns: 3 },
  { rows: 2, columns: 5 },
  { rows: 5, columns: 2 },
  { rows: 100, columns: 100 },
];

function decodeRgbaPng(filePath) {
  const png = fs.readFileSync(filePath);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual(png.subarray(0, 8), signature, "valid PNG signature");

  let offset = 8;
  let header;
  let ended = false;
  const idat = [];

  while (offset < png.length) {
    assert.ok(offset + 12 <= png.length, "complete PNG chunk header");
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    assert.ok(dataEnd + 4 <= png.length, `complete ${type} chunk`);
    const data = png.subarray(dataStart, dataEnd);

    if (type === "IHDR") {
      assert.equal(header, undefined, "only one IHDR chunk");
      assert.equal(length, 13, "IHDR length");
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      ended = true;
      offset = dataEnd + 4;
      break;
    }

    offset = dataEnd + 4;
  }

  assert.ok(header, "IHDR exists");
  assert.ok(ended, "IEND exists");
  assert.equal(offset, png.length, "no trailing bytes after IEND");
  assert.equal(header.bitDepth, 8, "8-bit channel depth");
  assert.equal(header.colorType, 6, "RGBA color type");
  assert.equal(header.compression, 0, "standard PNG compression");
  assert.equal(header.filter, 0, "standard PNG filter method");
  assert.equal(header.interlace, 0, "non-interlaced PNG");

  const { width, height } = header;
  assert.ok(width > 0 && height > 0, "positive PNG dimensions");
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const raw = inflateSync(Buffer.concat(idat));
  assert.equal(raw.length, height * (stride + 1), "decompressed scanline length");

  const pixels = Buffer.alloc(height * stride);

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  }

  for (let y = 0; y < height; y++) {
    const inputStart = y * (stride + 1);
    const filterType = raw[inputStart];
    const rowStart = y * stride;
    const priorStart = rowStart - stride;

    for (let x = 0; x < stride; x++) {
      const value = raw[inputStart + 1 + x];
      const left = x >= bytesPerPixel ? pixels[rowStart + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[priorStart + x] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel
        ? pixels[priorStart + x - bytesPerPixel]
        : 0;

      let predictor;
      switch (filterType) {
        case 0: predictor = 0; break;
        case 1: predictor = left; break;
        case 2: predictor = up; break;
        case 3: predictor = Math.floor((left + up) / 2); break;
        case 4: predictor = paeth(left, up, upperLeft); break;
        default: assert.fail(`unsupported PNG filter type: ${filterType}`);
      }
      pixels[rowStart + x] = (value + predictor) & 0xff;
    }
  }

  return { width, height, pixels };
}

for (const fixture of fixtures) {
  test(`PNG and JSON export fixtures agree for ${fixture.rows}x${fixture.columns}`, () => {
    const stem = `pixelartjs-${fixture.rows}x${fixture.columns}`;
    const jsonPath = path.join(root, "JSON", `${stem}.json`);
    const pngPath = path.join(root, "PNG", `${stem}.png`);
    const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    assert.deepEqual(Object.keys(json).sort(), ["array_elements", "columns", "rows"]);
    assert.equal(json.rows, fixture.rows);
    assert.equal(json.columns, fixture.columns);
    assert.ok(Array.isArray(json.array_elements));

    const total = fixture.rows * fixture.columns;
    const occupied = new Set();
    for (const index of json.array_elements) {
      assert.ok(Number.isInteger(index), "occupied positions are integer indices");
      assert.ok(index >= 0 && index < total, "occupied index is within the grid");
      assert.ok(!occupied.has(index), "occupied indices are unique");
      occupied.add(index);
    }

    const image = decodeRgbaPng(pngPath);
    assert.equal(image.width, fixture.columns, "PNG width equals JSON columns");
    assert.equal(image.height, fixture.rows, "PNG height equals JSON rows");

    for (let index = 0; index < total; index++) {
      const pixelOffset = index * 4;
      const expected = occupied.has(index) ? 0 : 255;
      assert.equal(image.pixels[pixelOffset], expected, `red channel at position ${index}`);
      assert.equal(image.pixels[pixelOffset + 1], expected, `green channel at position ${index}`);
      assert.equal(image.pixels[pixelOffset + 2], expected, `blue channel at position ${index}`);
      assert.equal(image.pixels[pixelOffset + 3], 255, `alpha channel at position ${index}`);
    }
  });
}
