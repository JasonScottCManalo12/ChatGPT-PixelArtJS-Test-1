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
4. Verified the expanded Node test suite locally: **6 passed, 0 failed**.
5. Verified GitHub Actions PR run **43687470689** completed successfully.
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

**Status: Acceptance evidence substantially complete; release approval pending.** The acceptance-hardening PR #5 was merged into `pixelartjs-new-ui-v1` after its CI run succeeded. This does not merge or modify `main`.

The user-reported 150/150 result is strong manual evidence, but the outstanding gates above must be completed or explicitly waived before calling V1 fully accepted. This update does not merge into `pixelartjs-new-ui-v1` or `main`.


## Supplemental regression update — 2026-11-15

After the original 150/150 baseline, the user completed a further **41/41 reported PASS checks** across the following areas:

| Follow-up area | Result |
|---|---:|
| Main workspace input validation | 8/8 |
| Main workspace canvas preservation | 3/3 |
| Hanoi of Colors boundaries and behavior | 6/6 |
| Coordinate Placement vs Array Relocation | 5/5 |
| PNG export regression | 5/5 |
| JSON export regression | 5/5 |
| Cross-platform regression | 4/4 |
| Final functional regression and stability | 5/5 |
| **Supplemental total** | **41/41** |

The supplemental results include main-workspace input validation (blank, decimal, zero, negative, minimum 1, maximum 100, and above-maximum values), canvas preservation after invalid input, Hanoi 1×1/5×5/2×5 and invalid/reset/next-state checks, Visual Experiment tests through its actual 10×10 maximum, PNG/JSON regression at 1×1/3×3/2×5/5×2/100×100, Android and Windows workflow checks, cross-platform output equivalence, three-section navigation/isolation, and repeated-operation stability.

**Counting rule:** These 41 checks overlap the original 150-check evidence categories. They are a supplemental test-session record and must not be added to 150 as 41 unique new acceptance requirements. The accurate statement is: original baseline 150/150 user-reported checks passed, followed by a supplemental session of 41/41 user-reported checks passed.

## Updated outstanding release gates

Completed by user-reported follow-up:
- Main workspace input validation and preservation after invalid input.
- Hanoi additional boundary, invalid-input, reset, and next-state checks.
- Follow-up PNG and JSON export regression across five representative grid sizes.
- Android and Windows functional workflow and output-equivalence checks.
- Three-section reset/regeneration, navigation/isolation, and repeated-operation stability.

Still open:
- Record exact Android device model, Android version, browser/version, viewport, and tested build/commit.
- Record exact Windows version, browser/version, viewport, and tested build/commit.
- Independently inspect the actual PNG export files and record pixel dimensions.
- Independently parse actual JSON export files and compare their complete contents with the source workspace.
- Capture separate numerical performance measurements if quantitative performance certification is required.
- Complete final release review and obtain explicit approval before any merge into `main`.

All follow-up manual results remain user-reported evidence. No application source/runtime behavior was changed by this documentation update.
