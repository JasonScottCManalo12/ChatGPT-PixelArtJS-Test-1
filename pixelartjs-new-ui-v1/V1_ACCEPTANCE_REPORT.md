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

The manual results are user-reported. They were not independently reproduced during this documentation update. Android and Windows device/OS details, browser versions, display resolutions, and viewport sizes have now been recovered and recorded. A pinned tested application commit remains unavailable.

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

- [x] Capture Android and Windows environment details, including OS/build, browser/version, display resolution, and viewport.
- [ ] Pin or otherwise identify the tested application commit for each platform.
- Individually verify blank, decimal, zero, negative, and out-of-range main-workspace dimension inputs.
- Test Hanoi at additional boundary dimensions, including 5×5, and verify invalid blank/decimal values.
- Independently inspect representative PNG files and parse/compare representative JSON exports.
- Capture separate numerical performance measurements if quantitative performance certification is required.
- Verify the new GitHub Actions workflow completes successfully on the pull request.
- Review the final PR and explicitly decide whether to merge into `pixelartjs-new-ui-v1`.

## Release decision

**Status: Acceptance evidence substantially complete; release approval pending.** The acceptance-hardening PR #5 was merged into `pixelartjs-new-ui-v1` after its CI run succeeded. This does not merge or modify `main`.

The user-reported 150/150 result is strong manual evidence, but the outstanding gates above must be completed or explicitly waived before calling V1 fully accepted. This update does not merge into `pixelartjs-new-ui-v1` or `main`.


## Documentation addendum — recovered Android environment (2026-11-15)

After the original report was prepared, the user recovered the Android environment used to test a locally stored PixelArtJS V1 copy:

| Field | Recovered value |
|---|---|
| Device | OPPO CPH2773 |
| OS | Android 14, build 2400 (build number as reported) |
| Browser | Google Chrome 151.0.7922.173 |
| Physical display resolution | HD+ 1604 × 720 pixels (as reported; axis/orientation convention not independently verified) |
| Browser viewport | 360 × 669 CSS pixels |
| Application access | Local `index.html` opened in Chrome through Android `content://` |
| Hosting | Local file-provider access; not GitHub Pages and no local web server reported |
| Test date | 2026-11-15 |

The local README, HTML excerpts, and Node test source were inspected by the user and supplied in the conversation. The README identifies the copy as PixelArtJS V1. The inspected HTML contains the described main workspace, PNG/JSON export logic, Hanoi of Colors simulator, and Coordinate Placement vs Array Relocation experiment. The supplied local `tests/sequence.test.js` contains four test cases.

### Provenance and evidence qualification

- The exact commit/build used for the Android test copy remains **unknown**. No commit hash or build identifier was present in the supplied README or HTML excerpts.
- The local files have not been proven byte-for-byte identical to the repository files on this branch. Do not attribute the repository branch's commit to the locally tested copy without a file comparison or other provenance evidence.
- The four test cases inspected in the local copy are distinct from the repository's documented expanded six-test suite and do not establish that the latter ran on Android.
- The 150/150 manual acceptance tally remains user-reported. Recovering environment details improves traceability but does not independently reproduce or upgrade those results.

### Updated outstanding platform/provenance gates

- [x] Recover Android device, OS/build, browser/version, physical display resolution, viewport, and local launch method.
- [ ] Record exact Windows version/build, browser/version, viewport, and test date.
- [ ] Identify or reproduce the exact Android-tested application revision; commit/build remains unknown.
- [ ] Pin the application revision for any new acceptance rerun and record its commit hash.


## Documentation addendum — recovered Windows environment (2026-11-15)

The user confirmed the Windows PC used for PixelArtJS V1 testing and provided these details:

| Field | Recovered value |
|---|---|
| Device | ASUS X542UAR |
| Operating system | Windows 10 |
| OS build | 19045.6466 |
| Browser | Google Chrome 157.0.8103.52 |
| Physical display resolution | 1920 × 1080 pixels |
| Browser viewport | 1084 × 738 CSS pixels |
| Test date | 2026-11-15 |

The Windows environment identification item is now complete based on user-reported information. Together with the Android addendum above, both platform environments are documented.

### Remaining provenance limitation

The exact application commit/build used for the Windows tests remains unknown. Recording the device and browser environment does not prove which repository revision was tested and does not independently reproduce the reported 150/150 manual results.
