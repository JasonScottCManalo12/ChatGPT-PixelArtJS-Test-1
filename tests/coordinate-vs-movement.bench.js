"use strict";

// Isolated experiment: arithmetic coordinate placement vs array relocation.
// This does not alter the existing simulator or claim to reproduce the
// original three-computation PixelArtJS implementation.

const { performance } = require("node:perf_hooks");
const assert = require("node:assert/strict");

function makeEntries(rows, columns) {
  const entries = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      entries.push({ row, column, value: (row * 17 + column * 31) % 256 });
    }
  }
  return entries;
}

// Method A: calculate the flat row-major destination and write directly.
function arithmeticPlacement(entries, rows, columns) {
  const output = new Array(rows * columns);
  for (const entry of entries) {
    const index = entry.row * columns + entry.column;
    output[index] = entry.value;
  }
  return output;
}

// Method B: maintain an array by inserting each value at its destination.
// Splice may shift existing elements, representing actual array relocation.
function relocationPlacement(entries, rows, columns) {
  const output = [];
  for (const entry of entries) {
    const index = entry.row * columns + entry.column;
    output.splice(index, 0, entry.value);
  }
  return output;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function benchmark(fn, entries, rows, columns, rounds = 7) {
  fn(entries, rows, columns); // warm-up
  const samples = [];
  for (let round = 0; round < rounds; round += 1) {
    const start = performance.now();
    fn(entries, rows, columns);
    samples.push(performance.now() - start);
  }
  return median(samples);
}

function runCase(rows, columns) {
  const entries = makeEntries(rows, columns);
  const direct = arithmeticPlacement(entries, rows, columns);
  const moved = relocationPlacement(entries, rows, columns);

  assert.deepEqual(direct, moved, `Output mismatch at ${rows}x${columns}`);

  const arithmeticMs = benchmark(arithmeticPlacement, entries, rows, columns);
  const relocationMs = benchmark(relocationPlacement, entries, rows, columns);
  return {
    dimensions: `${rows}x${columns}`,
    pixels: rows * columns,
    arithmeticMedianMs: Number(arithmeticMs.toFixed(4)),
    relocationMedianMs: Number(relocationMs.toFixed(4)),
    relocationOverArithmetic: Number((relocationMs / Math.max(arithmeticMs, 0.000001)).toFixed(2))
  };
}

const cases = [
  [3, 3],
  [10, 10],
  [50, 50],
  [100, 100]
];

const results = cases.map(([rows, columns]) => runCase(rows, columns));
console.log(JSON.stringify({
  experiment: "arithmetic-coordinate-placement-vs-array-relocation",
  correctness: "PASS: both methods produce identical row-major outputs",
  timingNote: "Informational only; timings depend on runtime and hardware.",
  results
}, null, 2));
