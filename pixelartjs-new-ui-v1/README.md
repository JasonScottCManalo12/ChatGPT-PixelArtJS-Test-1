# PixelArtJS V1

## Scope

V1 is the primary occupancy-grid workspace, with two preserved research components: the original Hanoi of Colors simulator and the Coordinate Placement vs Array Relocation visual experiment. They remain separate from the main workspace.

## Main workspace

- Configure dimensions from 1 to 100.
- Generate occupancy combinations by increasing cardinality, then lexicographic position order.
- Occupied pixels are black; empty pixels are white.
- Export the current grid as PNG or JSON.
- Preserve the configured row-to-column aspect ratio and square cells, including non-square dimensions.
- No step counter or activity/event log.

## Preserved Hanoi of Colors simulator

A separate 1–5 row/column simulator with empty initial state, next-state generation, reset, occupancy display, and JSON configuration export. It intentionally has no step counter or event log.

## Preserved visual experiment

Compares arithmetic flat-index placement (`row * columns + column`) with `Array.splice()` relocation using identical coordinate/value entries. It verifies output equality and reports a seven-sample median after warm-up. Timing is informational and browser/device-dependent; it is not a performance certification.

## Run

Open `index.html` in a modern browser. No package installation, build step, server, or external dependency is required.

## Verification

See [TEST_PLAN.md](TEST_PLAN.md). Run the automated sequence tests with `node --test tests/sequence.test.js`.
