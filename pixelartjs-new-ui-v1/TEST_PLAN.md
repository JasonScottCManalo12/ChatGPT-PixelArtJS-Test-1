# V1 Test Plan

## Smoke-test record

**Test evidence:** Browser/device results below were reported by the user on 2026-11-15. They are user-reported manual checks, not independently reproduced by the project maintainers or automated tests. Device/browser/viewport details were not recorded.

### Main workspace — 13/13 user-reported PASS

- [x] 1×1 dimensions.
- [x] 3×3 dimensions.
- [x] 2×5 dimensions.
- [x] 5×2 dimensions.
- [x] 1×100 dimensions.
- [x] 100×1 dimensions.
- [x] 100×100 dimensions.
- [x] Invalid dimensions.
- [x] Reset.
- [x] Generate sequence.
- [x] PNG export.
- [x] JSON export.
- [x] Repeated exports.

### Hanoi of Colors simulator — 6/6 user-reported PASS

- [x] 1×1.
- [x] 3×3.
- [x] Invalid dimensions.
- [x] Reset.
- [x] JSON configuration export.
- [x] No step counter/activity log present (the reported “Step Counter/Activity Log — PASS” is interpreted against the existing specification and implementation, which intentionally omit these features).

### Coordinate Placement vs Array Relocation — 6/6 user-reported PASS

- [x] 1×1.
- [x] 3×3.
- [x] Non-square grid.
- [x] 10×10.
- [x] Timing display/measurement.
- [x] Invalid dimensions.
- [x] Explicit browser confirmation that Method A and Method B outputs are identical for 1×1, 3×3, non-square, and 10×10 configurations — user-reported PASS on 2026-11-15.

**User-reported smoke-test tally: 25/25 PASS.** One additional equality observation remains pending and is not included in that tally.

## Main workspace detailed test expectations

- [ ] 1×1, 3×3, 2×5, 5×2, 1×100, 100×1, and 100×100 dimensions preserve row/column ratio and square cells.
- [ ] Invalid, decimal, blank, and out-of-range dimensions show visible feedback and do not mutate the canvas.
- [ ] Generation follows increasing cardinality and lexicographic order, then stops at the full state.
- [ ] Reset restores the empty state and counts.
- [ ] PNG dimensions equal columns × rows; empty pixels are white and occupied pixels black.
- [ ] JSON parses and contains accurate rows, columns, and occupancy array.
- [ ] Repeated downloads work; 10,000-cell rendering remains usable on target desktop/mobile browsers.

## Hanoi of Colors simulator detailed test expectations

- [ ] 1×1 and 3×3 sequences begin empty, advance, and finish correctly.
- [ ] Dimensions are whole numbers from 1–5; invalid values show feedback.
- [ ] Reset clears occupancy; exported configuration JSON is valid and accurately describes dimensions and indexing.
- [x] No step counter or activity/event log is part of the accepted simulator scope; the current UI source contains neither.

## Visual experiment detailed test expectations

- [x] 1×1, 3×3, non-square, and 10×10 outputs explicitly observed to match between both methods — user-reported PASS.
- [ ] Invalid dimensions show feedback.
- [x] Timing is displayed as browser-dependent and informational, not as a deterministic performance assertion.
- [x] Record the displayed output-equality verdict for each tested dimension set — all four reported PASS on 2026-11-15.

## Acceptance boundary

Source checks and automated tests do not replace real browser testing. The smoke-test record above reflects user-reported manual observations. Record browser, OS/device, viewport, and observed results before marking full browser acceptance complete.
