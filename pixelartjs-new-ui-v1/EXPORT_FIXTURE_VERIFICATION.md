# V1 Export Fixture Verification

**Scope:** independent structural and pixel-level verification of the committed PNG/JSON fixture pairs.

## Fixtures inspected

| Grid (rows × columns) | JSON fixture | PNG fixture | PNG dimensions (width × height) |
|---|---|---|---|
| 1×1 | Present | Present | 1×1 |
| 3×3 | Present | Present | 3×3 |
| 2×5 | Present | Present | 5×2 |
| 5×2 | Present | Present | 2×5 |
| 100×100 | Present | Present | 100×100 |

The PNG width correctly corresponds to the JSON `columns` value, and PNG height corresponds to `rows`.

## Independent inspection findings

- All five JSON files parse successfully and contain exactly `rows`, `columns`, and `array_elements`.
- The recorded dimensions match each fixture's filename and expected grid.
- All five JSON `array_elements` arrays are empty. These are empty-initial-state fixtures.
- All five PNG files have valid PNG signatures and RGBA 8-bit, non-interlaced image headers.
- PNG dimensions match the paired JSON dimensions.
- All inspected PNG pixels are opaque white, consistent with the empty occupancy arrays.
- No occupied/black pixels are represented in this fixture set.

## Automated verification

`tests/export-fixtures.test.js` uses Node.js built-ins only. It independently decodes the PNG scanlines (including PNG filters 0–4) and checks each PNG pixel against the paired JSON occupancy indices.

For each of the five fixture pairs, the test verifies:
- JSON syntax, exact object keys, dimensions, array type, integer index bounds, and index uniqueness.
- PNG signature, chunk boundaries, IHDR properties, IDAT decompression, scanline reconstruction, and IEND placement.
- PNG width/height against JSON columns/rows.
- Every pixel's RGB value (black for occupied indices, white for empty indices) and full opacity.

Run both V1 test suites with:

```sh
node --test pixelartjs-new-ui-v1/tests/sequence.test.js pixelartjs-new-ui-v1/tests/export-fixtures.test.js
```

## Evidence boundary and remaining work

- These committed fixtures verify the empty initial state only. They do not independently verify non-empty PNG/JSON exports or prove the historical 150/150 manual test results.
- The fixtures' exact source application commit/build is not recorded. Their presence in the repository does not establish which source revision generated them.
- The verifier checks the decoded image data and structural PNG boundaries; it does not currently validate PNG chunk CRC checksums.
- Populated-state fixtures (including representative sparse, dense, and full occupancy patterns) are still needed for broader export coverage.
- Android and Windows test-environment details are documented in `TEST_PLAN.md`; the exact historical tested application revision remains unknown.

**Status:** empty-state fixture verification implemented; automated CI result pending. No application runtime code is changed by this work.
