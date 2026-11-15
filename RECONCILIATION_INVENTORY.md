# Legacy Windows and Android Download Reconciliation

## Scope

This branch preserves the legacy download artifacts supplied for the PixelArtJS V1 Windows and Android testing sessions. The artifacts are retained as historical evidence and are not treated as current application source.

Target comparison branch: `pixelartjs-new-ui-v1`

Reconciliation branch: `reconcile/legacy-windows-android`

## Preserved artifacts

| Artifact | Repository path | Blob SHA-1 | Notes |
|---|---|---|---|
| Android download | `android.zip` | `1062a48b0168307217b38c264b9a2543b04d23fb` | ZIP archive; 8,970 bytes |
| Windows download | `windows.zip` | `98f8cc531e6e13e89f71d14e27d2e08c16d3445f` | ZIP archive; 8,397 bytes |
| Additional Windows archive | `windows/pixelartjs-new-ui-v1.rar` | `a815a2479251d8fe19dc03e73b615a6c776f61cf` | Also present on this branch; contents not yet inspected |

## Archive inventory

### android.zip

Contains six ZIP entries:

| Entry | Uncompressed bytes | CRC-32 |
|---|---:|---|
| `pixelartjs-new-ui-v1/README.md` | 1,497 | `47661d13` |
| `pixelartjs-new-ui-v1/TEST_PLAN.md` | 3,380 | `75814585` |
| `pixelartjs-new-ui-v1/index.html` | 15,811 | `7ed43a1f` |
| `pixelartjs-new-ui-v1/tests/sequence.test.js` | 951 | `825eac96` |

Directory entries are omitted from the table.

### windows.zip

Contains six ZIP entries:

| Entry | Uncompressed bytes | CRC-32 |
|---|---:|---|
| `pixelartjs-new-ui-v1/README.md` | 1,497 | `47661d13` |
| `pixelartjs-new-ui-v1/TEST_PLAN.md` | 1,472 | `fcbd3c9e` |
| `pixelartjs-new-ui-v1/index.html` | 15,811 | `7ed43a1f` |
| `pixelartjs-new-ui-v1/tests/sequence.test.js` | 951 | `825eac96` |

Directory entries are omitted from the table.

## Initial comparison against the current branch

The current `pixelartjs-new-ui-v1` branch files were fetched and fingerprinted. Their CRC-32 values do not match the corresponding archived file entries:

| File | Archived Windows / Android CRC-32 | Current branch CRC-32 |
|---|---|---|
| `README.md` | `47661d13` | `fccd67c9` |
| `index.html` | `7ed43a1f` | `78d7d4e8` |
| `tests/sequence.test.js` | `825eac96` | `b94951b1` |
| `TEST_PLAN.md` | Windows: `fcbd3c9e`; Android: `75814585` | `89c5340b` |

This establishes that the archived file entries are not byte-identical to the current branch versions. It does not, by itself, establish the exact historical commit from which either archive was produced.

## Test evidence handling

- Preserve the reported 150/150 manual PASS results as evidence for the downloaded versions actually tested.
- Do not relabel those results as tests of the current branch.
- Do not rerun the full regression suite solely to reconcile version provenance.
- Identify only changes that could affect previously tested behavior before considering any targeted validation.
- Exact tested commit SHAs were not captured at the time of the Windows and Android tests.

## Automated content audit results

**Audit workflow:** [Run 4 — Legacy Download Reconciliation Audit](https://github.com/JasonScottCManalo12/ChatGPT-PixelArtJS-Test-1/actions/runs/43714065487)  
**Result:** Success  
**Audited commit:** `48a73eda5a2948f0389ffe90e53de1e6e5386977`  
**Artifact:** `pixelartjs-legacy-reconciliation-report` (artifact ID `14161528994`, retained until 2026-12-15)

The workflow successfully extracted both ZIP archives and the Windows RAR archive, computed SHA-256 hashes, and generated full text diffs. It inspected archives as data only and did not execute archived application code or tests.

### File comparison

| File | Android ZIP | Windows ZIP | Windows RAR |
|---|---|---|---|
| `index.html` | IDENTICAL | IDENTICAL | IDENTICAL |
| `README.md` | DIFFERENT | DIFFERENT | DIFFERENT |
| `TEST_PLAN.md` | DIFFERENT | DIFFERENT | DIFFERENT |
| `tests/sequence.test.js` | DIFFERENT | DIFFERENT | DIFFERENT |

The report contains 12 archive-entry comparisons: 3 IDENTICAL and 9 DIFFERENT. These counts include the same logical files repeated across the three archives; they are not 12 distinct project files.

### Findings

1. **Application source:** The archived `index.html` is byte-for-byte identical across Android ZIP, Windows ZIP, and Windows RAR, and matches the current branch's `index.html` exactly (SHA-256 `3823318f7dc24b09673fe1477c9195f61e0b49b49ef71ab83b06eacdfb8b59f5`).
2. **Platform comparison:** The Android ZIP and Windows ZIP contain the same README, application HTML, and sequence test bytes. Their `TEST_PLAN.md` files differ. The Windows RAR matches the Windows ZIP on all four inspected files.
3. **Test documentation:** The current branch's `TEST_PLAN.md` is substantially more complete than the archived copies. It consolidates the reported 150/150 manual checks, clarifies evidence limitations, and records the expanded test categories. The older Windows test plan is especially short; the Android test plan has a smaller earlier smoke-test record.
4. **Automated sequence tests:** The current `sequence.test.js` expands the archived compact four-test suite to six tests, adds invariant checks for exhaustive 5- and 10-position sequences, and checks the first/final boundaries for a 10,000-position grid.
5. **README:** The current README adds links to the consolidated acceptance report and test plan, CI details, and a clarification separating user-reported manual checks from automated verification.
6. **No recovered application feature identified:** Within the four files present in these archives, no application HTML/source difference or platform-specific feature difference was found. The observed changes are documentation and automated-test evolution.

### Remaining review work

1. Record the best-available historical provenance; exact tested commit SHAs were not captured.
2. Review the draft PR and decide whether to retain the archives and inventory as historical evidence.
3. Do not merge without explicit user approval.

No application source files have been changed by this reconciliation inventory. No merge is authorized by this document.


## Automated audit workflow

A dedicated GitHub Actions workflow has been added at `.github/workflows/legacy-reconciliation-audit.yml`.

- It can be started manually with `workflow_dispatch`.
- It also triggers when the ZIP/RAR artifacts or workflow definition change on this reconciliation branch.
- It inspects ZIP and RAR contents as data; it does not execute archived application code or tests.
- It compares extracted file bytes with the current `pixelartjs-new-ui-v1` checkout and produces a Markdown report, JSON results, and an uploaded workflow artifact.
- It does not modify application source files or merge branches.

The workflow completed successfully on 2026-11-15. Run 4 and its report artifact are recorded above.
