# V1 Test Plan

## Main workspace

- [ ] 1×1, 3×3, 2×5, 5×2, 1×100, 100×1, and 100×100 dimensions preserve row/column ratio and square cells.
- [ ] Invalid, decimal, blank, and out-of-range dimensions show visible feedback and do not mutate the canvas.
- [ ] Generation follows increasing cardinality and lexicographic order, then stops at the full state.
- [ ] Reset restores the empty state and counts.
- [ ] PNG dimensions equal columns × rows; empty pixels are white and occupied pixels black.
- [ ] JSON parses and contains accurate rows, columns, and occupancy array.
- [ ] Repeated downloads work; 10,000-cell rendering remains usable on target desktop/mobile browsers.

## Hanoi of Colors simulator

- [ ] 1×1 and 3×3 sequences begin empty, advance, and finish correctly.
- [ ] Dimensions are whole numbers from 1–5; invalid values show feedback.
- [ ] Reset clears occupancy; exported configuration JSON is valid and accurately describes dimensions and indexing.
- [ ] No step counter or event log is present.

## Visual experiment

- [ ] 1×1, 3×3, non-square, and 10×10 outputs match between both methods.
- [ ] Invalid dimensions show feedback.
- [ ] Timing is treated as browser-dependent and informational, not as a deterministic test assertion.

## Acceptance boundary

Source checks and automated tests do not replace real browser testing. Record browser, OS/device, viewport, and observed results before marking browser acceptance complete.
