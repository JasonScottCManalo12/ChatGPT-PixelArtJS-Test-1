(() => {
  "use strict";
  const engine = window.PixelArtColorEngine;
  const mode = document.querySelector("#mode");
  const widthInput = document.querySelector("#width");
  const heightInput = document.querySelector("#height");
  const canvas = document.querySelector("#art");
  const context = canvas.getContext("2d", { alpha: false });
  const status = document.querySelector("#status");
  const download = document.querySelector("#download");
  let lastGenerated = null;

  function generate() {
    try {
      const result = engine.generateGrid({
        mode: mode.value,
        width: Number(widthInput.value),
        height: Number(heightInput.value)
      });
      canvas.width = result.width;
      canvas.height = result.height;
      const imageData = new ImageData(result.pixels, result.width, result.height);
      context.putImageData(imageData, 0, 0);
      lastGenerated = result;
      download.disabled = false;
      document.querySelector("#dimensions").textContent = result.width + " × " + result.height + " pixels";
      document.querySelector("#pixel-count").textContent = (result.width * result.height).toLocaleString() + " pixels";
      status.className = "status success";
      status.textContent = "Generated " + (result.width * result.height).toLocaleString() + " pixels using the " + mode.options[mode.selectedIndex].text + " generator.";
    } catch (error) {
      status.className = "status error";
      status.textContent = error.message;
      download.disabled = true;
    }
  }

  function runTests() {
    const list = document.querySelector("#test-results");
    list.replaceChildren();
    const tests = [];
    const assert = (name, condition) => tests.push({ name, passed: Boolean(condition) });
    const names = Object.keys(engine.generators);
    names.forEach(name => {
      const color = engine.generators[name](17);
      assert(name + " returns three valid RGB bytes", Array.isArray(color) && color.length === 3 && color.every(v => Number.isInteger(v) && v >= 0 && v <= 255));
    });

    const bw = engine.generateGrid({ mode: "blackWhite", width: 4, height: 1 });
    assert("Black-and-white generator alternates black and white", bw.pixels[0] === 0 && bw.pixels[4] === 255 && bw.pixels[8] === 0 && bw.pixels[12] === 255);
    const rgb = engine.generateGrid({ mode: "rgb", width: 257, height: 1 });
    assert("RGB counter carries blue into green", rgb.pixels[4 * 255 + 2] === 255 && rgb.pixels[4 * 256] === 0 && rgb.pixels[4 * 256 + 1] === 1 && rgb.pixels[4 * 256 + 2] === 0);
    const all = engine.generateGrid({ mode: "allColors", width: 257, height: 1 });
    assert("All-colors division formula carries blue into green", all.pixels[4 * 256] === 0 && all.pixels[4 * 256 + 1] === 1);
    const rubik = engine.generateGrid({ mode: "rubik", width: 7, height: 1 });
    assert("Rubik palette cycles after six colors", rubik.pixels[0] === rubik.pixels[24] && rubik.pixels[1] === rubik.pixels[25]);
    const mapped = engine.generateGrid({ mode: "rgb", width: 2, height: 2 });
    assert("Shared row-major mapping writes opaque RGBA pixels", mapped.pixels.length === 16 && mapped.pixels[3] === 255 && mapped.pixels[7] === 255 && mapped.pixels[11] === 255 && mapped.pixels[15] === 255);
    let rejected = false;
    try { engine.generateGrid({ mode: "not-a-mode", width: 2, height: 2 }); } catch (_) { rejected = true; }
    assert("Unknown categories are rejected", rejected);

    tests.forEach(test => {
      const item = document.createElement("li");
      item.className = test.passed ? "pass" : "fail";
      item.textContent = (test.passed ? "PASS · " : "FAIL · ") + test.name;
      list.append(item);
    });
    const passed = tests.filter(test => test.passed).length;
    const summary = document.createElement("li");
    summary.className = passed === tests.length ? "pass" : "fail";
    summary.textContent = passed + " / " + tests.length + " tests passed.";
    list.append(summary);
  }

  document.querySelector("#generate").addEventListener("click", generate);
  document.querySelector("#test").addEventListener("click", runTests);
  mode.addEventListener("change", generate);
  download.addEventListener("click", () => {
    if (!lastGenerated) return;
    const link = document.createElement("a");
    link.download = "pixelartjs-" + lastGenerated.mode + "-" + lastGenerated.width + "x" + lastGenerated.height + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
  generate();
  runTests();
})();