(() => {
  "use strict";

  const MAX_DIMENSION = 5;
  const state = {
    rows: 3, columns: 3, filename: "hanoi-3x3.json",
    clickCount: 0, array_elements: [], log: [], currentCardinality: 0,
    dirty: false
  };

  const $ = selector => document.querySelector(selector);
  const grid = $("#canvas-grid");
  const clickCounter = $("#click-count");
  const arrayCount = $("#array-count");
  const visibleCount = $("#visible-count");
  const outsideCount = $("#outside-count");
  const arrayList = $("#array-list");
  const eventLog = $("#event-log");
  const generateButton = $("#generate-button");
  const fileStatus = $("#file-status");
  const newCanvasPanel = $("#new-canvas-panel");
  const newCanvasForm = $("#new-canvas-form");
  const newRowsInput = $("#new-rows-input");
  const newColumnsInput = $("#new-columns-input");
  const newCanvasSummary = $("#new-canvas-summary");
  const loadCanvasInput = $("#load-canvas-input");
  const imageFormatSelect = $("#image-format-select");

  function positionCount() { return state.rows * state.columns; }
  function totalStates() { return 2 ** positionCount(); }
  function record(message, kind = "action") {
    state.log.push({ message, kind, click: state.clickCount });
  }
  function setFileStatus(message, kind = "") {
    fileStatus.className = `status ${kind}`.trim();
    fileStatus.textContent = message;
  }
  function updateFileName() { $("#file-name-display").textContent = state.filename; }
  function validDimensions(rows, columns) {
    return Number.isInteger(rows) && Number.isInteger(columns)
      && rows >= 1 && rows <= MAX_DIMENSION
      && columns >= 1 && columns <= MAX_DIMENSION;
  }
  function updateNewCanvasSummary() {
    const rows = Number(newRowsInput.value);
    const columns = Number(newColumnsInput.value);
    if (!validDimensions(rows, columns)) {
      newCanvasSummary.textContent = `Rows and columns must each be between 1 and ${MAX_DIMENSION}.`;
      return false;
    }
    newCanvasSummary.textContent = `${rows} × ${columns} grid · ${rows * columns} positions · ${(2 ** (rows * columns)).toLocaleString()} possible occupancy states`;
    return true;
  }
  function sanitizeFilename(value, extension = ".json") {
    let name = String(value || "").trim().replace(/[\\\\/:*?"<>|]/g, "-");
    if (!name) name = `hanoi-${state.rows}x${state.columns}${extension}`;
    const suffix = extension.toLowerCase();
    if (!name.toLowerCase().endsWith(suffix)) name += suffix;
    return name;
  }
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function makeConfiguration() {
    const filename = sanitizeFilename(state.filename, ".json");
    return {
      format: "hanoi-of-colors-simulation",
      formatVersion: 1,
      filename,
      dimensions: { rows: state.rows, columns: state.columns },
      positions: positionCount(),
      indexing: "zero-based row-major; position = row * columns + column",
      occupancySequence: {
        order: "increasing occupied-position count, then lexicographic position combinations",
        totalStates: totalStates(),
        initialState: { step: 0, array_elements: [] },
        currentState: { step: state.clickCount, array_elements: [...state.array_elements] }
      },
      canvas: {
        initialBackground: "white",
        occupiedBackground: "black",
        initialArrayElements: [],
        array_elements: [...state.array_elements]
      }
    };
  }
  function hasUnsavedChanges() {
    return !state.dirty || window.confirm("This canvas has unsaved changes. Continue and discard them?");
  }
  function createNewCanvas(event) {
    event.preventDefault();
    if (!updateNewCanvasSummary()) {
      setFileStatus(`Choose rows and columns from 1 to ${MAX_DIMENSION}.`, "error");
      return;
    }
    if (!hasUnsavedChanges()) return;
    state.rows = Number(newRowsInput.value);
    state.columns = Number(newColumnsInput.value);
    state.filename = `hanoi-${state.rows}x${state.columns}.json`;
    state.clickCount = 0;
    state.array_elements = [];
    state.currentCardinality = 0;
    state.log = [];
    state.dirty = true;
    record(`New empty canvas created: ${state.rows} × ${state.columns}.`, "note");
    newCanvasPanel.hidden = true;
    updateFileName();
    render();
    setFileStatus(`New ${state.rows} × ${state.columns} canvas created. Save it as JSON to keep the configuration.`, "success");
  }
  function nextCombination(values, n) {
    const combination = [...values];
    const k = combination.length;
    for (let i = k - 1; i >= 0; i -= 1) {
      if (combination[i] < n - k + i) {
        combination[i] += 1;
        for (let j = i + 1; j < k; j += 1) combination[j] = combination[j - 1] + 1;
        return combination;
      }
    }
    return null;
  }
  function advanceCycle() {
    const n = positionCount();
    if (state.array_elements.length === n) {
      record("Sequence is complete. Create a new canvas to start again.", "condition");
      render();
      return;
    }
    let next;
    if (state.currentCardinality === 0) {
      state.currentCardinality = 1;
      next = [0];
    } else {
      next = nextCombination(state.array_elements, n);
      if (!next) {
        state.currentCardinality += 1;
        next = Array.from({ length: state.currentCardinality }, (_, index) => index);
      }
    }
    state.clickCount += 1;
    state.array_elements = next;
    state.dirty = true;
    record(`array_elements = [${state.array_elements.join(",")}]`);
    if (state.array_elements.length === n) record("Sequence complete: every position is occupied.", "condition");
    render();
  }
  function resetCanvas() {
    if (!hasUnsavedChanges()) return;
    state.clickCount = 0;
    state.array_elements = [];
    state.currentCardinality = 0;
    state.dirty = true;
    record(`Reset to empty ${state.rows} × ${state.columns} canvas.`, "note");
    render();
    setFileStatus("Canvas reset. Save as JSON to preserve this state.", "success");
  }
  function saveJson() {
    state.filename = sanitizeFilename(state.filename, ".json");
    const config = makeConfiguration();
    downloadBlob(new Blob([JSON.stringify(config, null, 2) + "\n"], { type: "application/json;charset=utf-8" }), state.filename);
    state.dirty = false;
    updateFileName();
    record(`Saved current canvas as ${state.filename}.`);
    renderLog();
    setFileStatus(`Downloaded ${state.filename} with the current canvas state.`, "success");
  }
  function loadJsonFile(file) {
    if (!file) return;
    if (!hasUnsavedChanges()) { loadCanvasInput.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const config = JSON.parse(String(reader.result));
        const rows = Number(config?.dimensions?.rows);
        const columns = Number(config?.dimensions?.columns);
        if (config?.format !== "hanoi-of-colors-simulation" || !validDimensions(rows, columns)) {
          throw new Error("Unsupported file format or invalid dimensions (rows/columns must be 1–5).");
        }
        const max = rows * columns;
        const candidate = config?.occupancySequence?.currentState?.array_elements
          ?? config?.canvas?.array_elements
          ?? config?.occupancySequence?.initialState?.array_elements
          ?? config?.canvas?.initialArrayElements
          ?? [];
        if (!Array.isArray(candidate) || candidate.some(value => !Number.isInteger(value) || value < 0 || value >= max)
          || new Set(candidate).size !== candidate.length) {
          throw new Error("The file contains an invalid array_elements position list.");
        }
        const positions = [...candidate].sort((a, b) => a - b);
        state.rows = rows;
        state.columns = columns;
        state.array_elements = positions;
        state.clickCount = Number.isInteger(config?.occupancySequence?.currentState?.step)
          ? Math.max(0, config.occupancySequence.currentState.step) : positions.length ? 1 : 0;
        state.currentCardinality = positions.length;
        state.filename = sanitizeFilename(file.name || config.filename || `hanoi-${rows}x${columns}.json`, ".json");
        state.dirty = false;
        state.log = [];
        record(`Loaded canvas from ${file.name}: ${rows} × ${columns}, ${positions.length} occupied position(s).`, "note");
        updateFileName();
        render();
        setFileStatus(`Loaded ${file.name} successfully.`, "success");
      } catch (error) {
        setFileStatus(`Could not load JSON: ${error.message}`, "error");
      } finally {
        loadCanvasInput.value = "";
      }
    };
    reader.onerror = () => {
      setFileStatus("The selected file could not be read.", "error");
      loadCanvasInput.value = "";
    };
    reader.readAsText(file);
  }
  function drawCanvasToBitmap(scale = 100) {
    const canvas = document.createElement("canvas");
    const width = state.columns * scale;
    const height = state.rows * scale;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    const occupied = new Set(state.array_elements);
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (let position = 0; position < positionCount(); position += 1) {
      const row = Math.floor(position / state.columns);
      const column = position % state.columns;
      const x = column * scale;
      const y = row * scale;
      context.fillStyle = occupied.has(position) ? "#111111" : "#ffffff";
      context.fillRect(x, y, scale, scale);
      context.strokeStyle = occupied.has(position) ? "#111111" : "#cbd5e1";
      context.lineWidth = 2;
      context.strokeRect(x + 1, y + 1, scale - 2, scale - 2);
      context.fillStyle = occupied.has(position) ? "#ffffff" : "#64748b";
      context.font = "bold 24px system-ui, sans-serif";
      context.fillText(String(position), x + scale / 2, y + scale / 2 - 10);
      context.font = "14px system-ui, sans-serif";
      context.fillText(occupied.has(position) ? "Occupied" : "Empty", x + scale / 2, y + scale / 2 + 18);
    }
    return canvas;
  }
  function encodeBmp(canvas) {
    const context = canvas.getContext("2d");
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    const rowSize = Math.floor((24 * canvas.width + 31) / 32) * 4;
    const pixelSize = rowSize * canvas.height;
    const buffer = new ArrayBuffer(54 + pixelSize);
    const view = new DataView(buffer);
    view.setUint8(0, 0x42); view.setUint8(1, 0x4d);
    view.setUint32(2, 54 + pixelSize, true);
    view.setUint32(10, 54, true);
    view.setUint32(14, 40, true);
    view.setInt32(18, canvas.width, true);
    view.setInt32(22, canvas.height, true);
    view.setUint16(26, 1, true);
    view.setUint16(28, 24, true);
    view.setUint32(34, pixelSize, true);
    for (let y = 0; y < canvas.height; y += 1) {
      const sourceY = canvas.height - 1 - y;
      for (let x = 0; x < canvas.width; x += 1) {
        const source = (sourceY * canvas.width + x) * 4;
        const target = 54 + y * rowSize + x * 3;
        view.setUint8(target, image.data[source + 2]);
        view.setUint8(target + 1, image.data[source + 1]);
        view.setUint8(target + 2, image.data[source]);
      }
    }
    return new Blob([buffer], { type: "image/bmp" });
  }
  function saveImage() {
    const format = imageFormatSelect.value;
    const canvas = drawCanvasToBitmap();
    const filename = sanitizeFilename(state.filename.replace(/\.json$/i, ""), `.${format === "jpeg" ? "jpg" : format}`);
    if (format === "bmp") {
      downloadBlob(encodeBmp(canvas), filename);
      setFileStatus(`Exported canvas as ${filename} (BMP).`, "success");
      return;
    }
    const mime = format === "jpeg" ? "image/jpeg" : "image/png";
    canvas.toBlob(blob => {
      if (!blob) {
        setFileStatus(`Could not export ${format.toUpperCase()} image.`, "error");
        return;
      }
      downloadBlob(blob, filename);
      setFileStatus(`Exported canvas as ${filename} (${format.toUpperCase()}).`, "success");
    }, mime, format === "jpeg" ? 0.92 : undefined);
  }
  function renderCanvas() {
    const occupied = new Set(state.array_elements);
    grid.replaceChildren();
    grid.style.gridTemplateColumns = `repeat(${state.columns}, minmax(0, 1fr))`;
    for (let position = 0; position < positionCount(); position += 1) {
      const isOccupied = occupied.has(position);
      const row = Math.floor(position / state.columns);
      const column = position % state.columns;
      const cell = document.createElement("div");
      cell.className = `canvas-cell ${isOccupied ? "occupied" : "empty"}`;
      cell.dataset.position = String(position);
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}, position ${position}: ${isOccupied ? "occupied" : "empty"}`);
      const positionLabel = document.createElement("span");
      positionLabel.className = "position";
      positionLabel.textContent = String(position);
      const occupantLabel = document.createElement("span");
      occupantLabel.className = "occupant";
      occupantLabel.textContent = isOccupied ? "Occupied · Black" : "Empty · White";
      cell.append(positionLabel, occupantLabel);
      grid.append(cell);
    }
  }
  function renderArrayList() {
    arrayList.replaceChildren();
    if (!state.array_elements.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "array_elements is empty.";
      arrayList.append(empty);
      return;
    }
    const label = document.createElement("p");
    label.className = "detail";
    label.textContent = `array_elements = [${state.array_elements.join(",")}]`;
    arrayList.append(label);
    state.array_elements.forEach(position => {
      const row = document.createElement("div");
      row.className = "array-row";
      const name = document.createElement("strong");
      name.textContent = `Position ${position} (R${Math.floor(position / state.columns) + 1}, C${position % state.columns + 1})`;
      const detail = document.createElement("span");
      detail.className = "detail";
      detail.textContent = "Occupied";
      row.append(name, detail);
      arrayList.append(row);
    });
  }
  function renderLog() {
    eventLog.replaceChildren();
    const recent = state.log.slice(-100).reverse();
    if (!recent.length) {
      const item = document.createElement("li");
      item.className = "log-note";
      item.textContent = "Ready. Canvas is empty.";
      eventLog.append(item);
      return;
    }
    recent.forEach(entry => {
      const item = document.createElement("li");
      item.className = entry.kind;
      item.textContent = entry.click ? `[Step ${entry.click}] ${entry.message}` : entry.message;
      eventLog.append(item);
    });
  }
  function render() {
    const n = positionCount();
    clickCounter.textContent = `Step ${state.clickCount.toLocaleString()} / ${(totalStates() - 1).toLocaleString()}`;
    arrayCount.textContent = String(state.array_elements.length);
    visibleCount.textContent = `${state.array_elements.length} / ${n}`;
    outsideCount.textContent = String(n - state.array_elements.length);
    $("#canvas-description").textContent = `${state.rows} rows × ${state.columns} columns · ${n} positions`;
    generateButton.disabled = state.array_elements.length === n;
    generateButton.textContent = generateButton.disabled ? "Sequence Complete" : "Generate · Next State";
    renderCanvas();
    renderArrayList();
    renderLog();
  }

  $("#new-canvas-button").addEventListener("click", () => {
    newRowsInput.value = String(state.rows);
    newColumnsInput.value = String(state.columns);
    updateNewCanvasSummary();
    newCanvasPanel.hidden = false;
    newRowsInput.focus();
  });
  $("#cancel-new-canvas-button").addEventListener("click", () => { newCanvasPanel.hidden = true; });
  newRowsInput.addEventListener("input", updateNewCanvasSummary);
  newColumnsInput.addEventListener("input", updateNewCanvasSummary);
  newCanvasForm.addEventListener("submit", createNewCanvas);
  $("#load-canvas-button").addEventListener("click", () => loadCanvasInput.click());
  loadCanvasInput.addEventListener("change", event => loadJsonFile(event.target.files?.[0]));
  $("#save-json-button").addEventListener("click", saveJson);
  $("#save-image-button").addEventListener("click", saveImage);
  generateButton.addEventListener("click", advanceCycle);
  $("#reset-button").addEventListener("click", resetCanvas);
  $("#clear-log-button").addEventListener("click", () => { state.log = []; renderLog(); });

  updateNewCanvasSummary();
  updateFileName();
  record("Ready. Empty 3 × 3 canvas.", "note");
  render();
})();