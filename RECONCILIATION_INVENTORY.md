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

## Remaining review work

1. Extract and inspect the archive contents, including the additional RAR artifact.
2. Compare full file contents and determine the actual source differences, beyond archive metadata and CRC fingerprints.
3. Determine whether the Windows and Android archives are identical application builds with different packaging or contain platform-specific differences.
4. Record the historical provenance as far as the available artifacts allow.
5. Review the pull request before any merge.

No application source files have been changed by this reconciliation inventory. No merge is authorized by this document.


## Automated audit workflow

A dedicated GitHub Actions workflow has been added at `.github/workflows/legacy-reconciliation-audit.yml`.

- It can be started manually with `workflow_dispatch`.
- It also triggers when the ZIP/RAR artifacts or workflow definition change on this reconciliation branch.
- It inspects ZIP and RAR contents as data; it does not execute archived application code or tests.
- It compares extracted file bytes with the current `pixelartjs-new-ui-v1` checkout and produces a Markdown report, JSON results, and an uploaded workflow artifact.
- It does not modify application source files or merge branches.

The workflow definition is committed. An automated audit run has now been triggered by this inventory update; its completion and generated report remain to be verified.
