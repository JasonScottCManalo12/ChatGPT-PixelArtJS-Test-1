# PixelArtJS V1 Acceptance Report

**Report date:** 2026-11-15  
**Version branch:** `pixelartjs-new-ui-v1`  
**Update branch:** `feature/v1-acceptance-hardening`  
**Application scope:** Main occupancy-grid workspace plus the preserved Hanoi of Colors simulator and Coordinate Placement vs Array Relocation experiment.

## Current result

**150/150 user-reported manual checks passed** across the recorded V1 test categories.

| Category | Result |
|---|---:|
| Main workspace smoke tests | 13/13 |
| Hanoi of Colors | 6/6 |
| Coordinate Placement vs Array Relocation | 10/10 |
| PNG export | 29/29 |
| JSON export | 35/35 |
| Sequence ordering | 20/20 |
| 100×100 performance smoke test | 5/5 |
| Cross-platform consistency | 16/16 |
| End-to-end regression | 16/16 |
| **Total** | **150/150** |

## Platform evidence

The user reported using both Android and Windows PC.

- Cross-platform consistency passed for 3×3, 2×5, 5×2, and 100×100.
- End-to-end regression passed 8/8 on Android and 8/8 on Windows PC.
- The 100×100 performance smoke test passed 5/5 with both platforms used, but separate platform timings and memory measurements were not captured.

## Evidence limitations

The manual results are user-reported. They were not independently reproduced during this documentation update. Exact browser versions, Android device/OS details, Windows build, viewport sizes, and a pinned tested application commit were not recorded.

The 100×100 sequence test used sampled/targeted checks. It does not claim exhaustive traversal of the (2^{10000}) possible occupancy states.

The 150/150 tally is not the same as 150 automated tests, and it does not independently establish release readiness.

## Work completed in this acceptance-hardening update

1. Expanded `TEST_PLAN.md` to record the full 150-check evidence set and identify remaining release gates.
2. Expanded the Node.js sequence tests with exhaustive invariants for 5- and 10-position sequences and boundary checks for a 10,000-position grid.
3. Added a GitHub Actions workflow to run the sequence tests on pushes to and pull requests targeting `pixelartjs-new-ui-v1`.
4. Preserved the main workspace and both research components; no application behavior was changed in this update.

## Remaining release gates

- Capture exact Android and Windows environment details and pin the tested application commit.
- Individually verify blank, decimal, zero, negative, and out-of-range main-workspace dimension inputs.
- Test Hanoi at additional boundary dimensions, including 5×5, and verify invalid blank/decimal values.
- Independently inspect representative PNG files and parse/compare representative JSON exports.
- Capture separate numerical performance measurements if quantitative performance certification is required.
- Verify the new GitHub Actions workflow completes successfully on the pull request.
- Review the final PR and explicitly decide whether to merge into `pixelartjs-new-ui-v1`.

## Release decision

**Status: Acceptance evidence substantially complete; release approval pending.**

The user-reported 150/150 result is strong manual evidence, but the outstanding gates above must be completed or explicitly waived before calling V1 fully accepted. This update does not merge into `pixelartjs-new-ui-v1` or `main`.
