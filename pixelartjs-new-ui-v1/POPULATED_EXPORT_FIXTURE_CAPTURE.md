# Populated Export Fixture Capture Protocol

**Purpose:** collect genuine PixelArtJS V1 PNG/JSON exports that exercise occupied (black) pixels. Do not hand-edit the exports or synthesize PNGs for these fixtures: they must be produced by the application so they can verify its real export behavior.

## Required capture set

Use the existing 3×3 and 100×100 grid sizes where practical. For every case, export both PNG and JSON from the same unchanged canvas state.

| Case | Suggested canvas state | What it exercises |
|---|---|---|
| P1 — Single occupied cell | 3×3, occupy only the top-left cell | Smallest non-empty export; one black pixel |
| P2 — Asymmetric sparse | 3×3, occupy top-right, center, and bottom-left | Position mapping; catches accidental mirroring/transposition |
| P3 — Mixed density | 5×5, occupy a visibly irregular pattern of roughly half the cells | Multiple rows/columns and mixed black/white pixels |
| P4 — Dense | 5×5, leave only a few deliberately selected cells empty | Black-pixel majority and white-pixel placement |
| P5 — Fully occupied | 3×3, occupy every cell | All-black boundary case |
| P6 — Large sparse | 100×100, occupy a few cells in different corners and near the center | Large-grid indexing and PNG dimensions |

## Capture procedure

1. Open the intended PixelArtJS V1 build and record its exact source commit or build identifier if available.
2. Create one pattern from the table. Keep the grid dimensions unchanged while exporting.
3. Save the PNG and JSON using the same case identifier, for example `P1-single-occupied.png` and `P1-single-occupied.json`.
4. Repeat for each case. Do not modify either exported file after saving.
5. Upload the paired files into:
   - `test-artifacts/export-verification/PNG/`
   - `test-artifacts/export-verification/JSON/`
6. Include a short capture note with device/OS/browser, app build/commit, grid dimensions, and which cells were occupied.
7. Run the existing Node.js CI suite. The independent verifier checks that JSON indices and decoded PNG black/white pixels agree.

## Acceptance criteria

- Each PNG/JSON pair comes from the same actual application state.
- JSON dimensions and PNG dimensions agree (PNG width = columns; PNG height = rows).
- JSON occupied indices are integers, unique, and within the grid.
- Every JSON occupied index maps to an opaque black PNG pixel.
- Every unoccupied index maps to an opaque white PNG pixel.
- The single-cell, asymmetric, mixed-density, dense, full, and large-sparse cases all pass.
- Capture provenance is recorded; no unverified historical source commit is invented.

## Existing fixtures

The existing five fixtures (1×1, 3×3, 2×5, 5×2, and 100×100) are verified empty-state fixtures. Keep them unchanged as baseline cases. Add populated cases as new pairs rather than overwriting the originals.

**Current status:** capture protocol ready; populated application-generated exports have not yet been supplied or verified.
