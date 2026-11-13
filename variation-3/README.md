# PixelArtJS — Variation 3: Shared Color Pipeline

This is an isolated experiment on the `variation-3` branch. It leaves the existing Variation 2/Hanoi of Colors files unchanged.

## Hypothesis

Color categories can use different generation algorithms while sharing one computational principle for producing an image.

## Architecture

1. A zero-based sequence index is supplied to a selected color generator.
2. The category-specific generator returns an RGB triplet.
3. The shared engine maps the flat index to row/column coordinates.
4. The RGB triplet is written into a shared RGBA pixel buffer.
5. The browser writes the buffer to Canvas `ImageData`.

The color generators do not need to know about canvas dimensions or pixel placement.

## Included generators

- Black and White — alternating black/white values.
- Grayscale — intensity progression.
- RGB — bitwise channel extraction from a sequential integer.
- Coffeeblake — illustrative warm-tone ramp for this prototype; not asserted to be the original historical formula.
- HSL — hue sweep converted to RGB.
- Rubik's Cube — six-color palette cycle.
- All RGB Colors — arithmetic channel extraction from a sequential integer.

## Run

Open `variation-3/index.html` in a modern browser. No build step or external library is required.

## Validation

The page runs a small self-test suite on load and provides a button to rerun it. The tests validate RGB byte output, selected sequence behavior, row-major RGBA placement, and rejection of unknown modes.

## Scope and limitations

This is a computational prototype, not yet the tap-game implementation. The Coffeeblake ramp is a placeholder demonstration until its exact original formula is supplied. Grayscale and HSL currently cycle their respective ranges when the pixel count exceeds one complete range. The RGB and All RGB Colors generators enumerate the same RGB order using two different coding formulas, allowing direct comparison of the increment-style/bitwise and division/remainder approaches.
