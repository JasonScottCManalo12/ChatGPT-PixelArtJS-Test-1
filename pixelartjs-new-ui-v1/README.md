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

- Test plan and manual evidence: [TEST_PLAN.md](TEST_PLAN.md)
- Consolidated release-gate status: [V1_ACCEPTANCE_REPORT.md](V1_ACCEPTANCE_REPORT.md)
- Run automated sequence tests: `node --test pixelartjs-new-ui-v1/tests/sequence.test.js`
- GitHub Actions runs the sequence tests for pushes to and pull requests targeting `pixelartjs-new-ui-v1`.

Manual browser checks are recorded as user-reported evidence; automated tests and CI are separate verification layers.
