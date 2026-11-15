# V1 Test Plan

## Evidence and status rules

- Manual browser/device results are **user-reported** unless independently reproduced or captured by an automated test.
- The user reported the results below on 2026-11-15.
- Android and Windows PC were both used. Browser names, OS versions, viewport sizes, and separate per-platform measurements were not recorded.
- A PASS in this plan records the reported test outcome; it does not imply an independent audit or a measured benchmark.
- The 100×100 sequence check is sampled/targeted. Exhaustively generating all `2^10000` states is not practical.

## Consolidated user-reported acceptance evidence

| Test category | Reported checks | Result |
|---|---:|---|
| Main workspace smoke tests | 13 | 13/13 PASS |
| Hanoi of Colors simulator | 6 | 6/6 PASS |
| Coordinate Placement vs Array Relocation, including output equality | 10 | 10/10 PASS |
| PNG pixel-level export validation | 29 | 29/29 PASS |
| JSON export validation | 35 | 35/35 PASS |
| Sequence ordering | 20 | 20/20 PASS |
| 100×100 performance smoke test | 5 | 5/5 PASS |
| Cross-platform consistency | 16 | 16/16 PASS |
| End-to-end regression | 16 | 16/16 PASS |
| **Total** | **150** | **150/150 PASS** |

**Evidence classification:** All 150 checks are user-reported manual results. The 150/150 tally is not an automated test count and is not, by itself, full release approval.

## Main workspace — 13/13 user-reported PASS

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

## Hanoi of Colors simulator — 6/6 user-reported PASS

- [x] 1×1.
- [x] 3×3.
- [x] Invalid dimensions.
- [x] Reset.
- [x] JSON configuration export.
- [x] No step counter/activity log present, consistent with the accepted scope.

## Coordinate Placement vs Array Relocation — 10/10 user-reported PASS

- [x] 1×1.
- [x] 3×3.
- [x] Non-square grid.
- [x] 10×10.
- [x] Timing display/measurement.
- [x] Invalid dimensions.
- [x] Identical row-major outputs at 1×1.
- [x] Identical row-major outputs at 3×3.
- [x] Identical row-major outputs on a non-square grid.
- [x] Identical row-major outputs at 10×10.

## PNG export pixel-level validation — 29/29 user-reported PASS

| Configuration | Reported checks | Result |
|---|---:|---|
| 1×1 | 6 | 6/6 PASS |
| 3×3 | 6 | 6/6 PASS |
| 2×5 | 6 | 6/6 PASS |
| 5×2 | 6 | 6/6 PASS |
| 100×100 | 5 | 5/5 PASS |
| **Total** | **29** | **29/29 PASS** |

Reported criteria covered correct occupied/empty colors, no unexpected colors, no missing/duplicated/distorted cells, no unintended gaps/borders/rounded corners, and correct exported dimensions/layout. For 100×100, the user additionally confirmed all 10,000 cells were represented.

## JSON export validation — 35/35 user-reported PASS

| Configuration | Reported checks | Result |
|---|---:|---|
| 1×1 | 7 | 7/7 PASS |
| 3×3 | 7 | 7/7 PASS |
| 2×5 | 7 | 7/7 PASS |
| 5×2 | 7 | 7/7 PASS |
| 100×100 | 7 | 7/7 PASS |
| **Total** | **35** | **35/35 PASS** |

The 100×100 checks explicitly included valid JSON syntax, exactly 100 rows and 100 columns, all 10,000 cell values, correct occupied/empty values, row-major ordering, no missing/duplicated/corrupted entries, and matching workspace data.

## Sequence ordering — 20/20 user-reported PASS

| Configuration | Reported checks | Result |
|---|---:|---|
| 1×1 | 5 | 5/5 PASS |
| 3×3 | 5 | 5/5 PASS |
| 2×5 | 5 | 5/5 PASS |
| 100×100 | 5 | 5/5 PASS |
| **Total** | **20** | **20/20 PASS** |

The reported checks covered empty initial state, increasing occupied-cell cardinality, lexicographic ordering, no duplicates in the tested range, and recognition of the full state. The 100×100 result is limited to sampled/targeted checks, not exhaustive sequence traversal.

## 100×100 performance smoke test — 5/5 user-reported PASS

The user confirmed using both Android and Windows PC. The five reported checks were:
- [x] Initial workspace rendering.
- [x] Canvas generation.
- [x] Scrolling and interaction responsiveness.
- [x] Memory/resource behavior.
- [x] Browser stability.

**Limit:** Results were reported for both platforms collectively; separate timings, memory measurements, browser names, and platform-specific sub-results were not captured. This is a qualitative smoke test, not a numerical benchmark or performance certification.

## Cross-platform consistency — 16/16 user-reported PASS

The user reported all four checks passing on both Android and Windows PC for each configuration:

| Configuration | Checks | Result |
|---|---:|---|
| 3×3 | 4 | 4/4 PASS |
| 2×5 | 4 | 4/4 PASS |
| 5×2 | 4 | 4/4 PASS |
| 100×100 | 4 | 4/4 PASS |
| **Total** | **16** | **16/16 PASS** |

Checks covered matching occupancy configurations, PNG consistency, JSON consistency, and equivalent cross-platform outputs.

## End-to-end regression — 16/16 user-reported PASS

The user reported all eight workflow steps passing on each platform:

1. Open or refresh the application.
2. Generate a 3×3 workspace.
3. Change occupancy states.
4. Export PNG.
5. Export JSON.
6. Reset the workspace.
7. Generate another configuration.
8. Confirm no previous state or export data contaminates the new configuration.

| Platform | Result |
|---|---:|
| Android | 8/8 PASS |
| Windows PC | 8/8 PASS |
| **Total** | **16/16 PASS** |

## Remaining acceptance work / release gates

The manual results are strong evidence, but the following items remain open until separately verified:

- [ ] Record exact Android device model, Android version, browser/version, viewport, and test date/build.
- [ ] Record exact Windows version, browser/version, viewport, and test date/build.
- [ ] Re-run or capture the detailed manual evidence against a pinned commit so the tested artifact is unambiguous.
- [ ] Test the main workspace's blank, decimal, zero, negative, and out-of-range dimension inputs individually, confirming visible feedback and no canvas mutation.
- [ ] Test Hanoi of Colors at additional boundary dimensions (including 5×5), and separately verify invalid decimal/blank/out-of-range inputs.
- [ ] Capture exact PNG pixel dimensions and inspect the exported PNG files directly for representative square, landscape, portrait, and 100×100 cases.
- [ ] Independently parse exported JSON files and compare their complete contents to the corresponding workspace states.
- [ ] Record measured load/render/export durations and memory observations separately for Android and Windows if quantitative performance acceptance is required.
- [ ] Run the automated Node test suite and verify the new GitHub Actions check on the acceptance branch/PR.
- [ ] Complete the release decision only after the remaining gates are either passed or explicitly waived.

## Acceptance boundary

The 150/150 tally is user-reported manual acceptance evidence. Automated tests, source inspection, and CI checks are separate evidence classes. Do not label V1 fully released or merge into `main` solely from this tally. Version branches remain independent and pull requests are the required review boundary before changes enter a destination branch.
