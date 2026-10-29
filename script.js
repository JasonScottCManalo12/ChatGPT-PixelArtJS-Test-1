(() => {
  "use strict";

  const MAX_DIMENSION = 5;
  const state = {
    rows: 3,
    columns: 3,
    clickCount: 0,
    array_elements: [],
    log: [],
    currentCardinality: 0
  };

  const grid = document.querySelector("#canvas-grid");
  const clickCounter = document.querySelector("#click-count");
  const arrayCount = document.querySelector("#array-count");
  const visibleCount = document.querySelector("#visible-count");
  const outsideCount = document.querySelector("#outside-count");
  const arrayList = document.querySelector("#array-list");
  const eventLog = document.querySelector("#event-log");
  const generateButton = document.querySelector("#generate-button");
  const resetButton = document.querySelector("#reset-button");
  const clearLogButton = document.querySelector("#clear-log-button");
  const configForm = document.querySelector("#config-form");
  const rowsInput = document.querySelector("#rows-input");
  const columnsInput = document.querySelector("#columns-input");
  const filenameInput = document.querySelector("#filename-input");
  const configSummary = document.querySelector("#config-summary");
  const fileStatus = document.querySelector("#file-status");

  function positionCount() {
    return state.rows * state.columns;
  }

  function totalStates() {
    return 2 ** positionCount();
  }

  function record(message, kind = "action") {
    state.log.push({ message, kind, click: state.clickCount });
  }

  function updateConfigSummary() {
    const rows = Number(rowsInput.value);
    const columns = Number(columnsInput.value);
    const valid = Number.isInteger(rows) && Number.isInteger(columns)
      && rows >= 1 && rows <= MAX_DIMENSION
      && columns >= 1 && columns <= MAX_DIMENSION;
    if (!valid) {
      configSummary.textContent = `Rows and columns must each be between 1 and ${MAX_DIMENSION}.`;
      return false;
    }
    configSummary.textContent = `${rows} × ${columns} grid · ${rows * columns} positions · ${(2 ** (rows * columns)).toLocaleString()} possible occupancy states`;
    return true;
  }

  function sanitizeFilename(value) {
    let name = value.trim().replace(/[\\/:*?"<>|]/g, "-");
    if (!name) name = `hanoi-${state.rows}x${state.columns}.json`;
    if (!name.toLowerCase().endsWith(".json")) name += ".json";
    return name;
  }

  function makeConfiguration(rows, columns, filename) {
    return {
      format: "hanoi-of-colors-simulation",
      formatVersion: 1,
      filename,
      dimensions: { rows, columns },
      positions: rows * columns,
      indexing: "zero-based row-major; position = row * columns + column",
      occupancySequence: {
        order: "increasing occupied-position count, then lexicographic position combinations",
        totalStates: 2 ** (rows * columns),
        initialState: { step: 0, array_elements: [] }
      },
      canvas: {
        initialBackground: "white",
        occupiedBackground: "black",
        initialArrayElements: []
      }
    };
  }

  function createFile(event) {
    event.preventDefault();
    if (!updateConfigSummary()) {
      fileStatus.className = "status error";
      fileStatus.textContent = `Unable to create file. Use dimensions from 1 to ${MAX_DIMENSION}.`;
      return;
    }

    const rows = Number(rowsInput.value);
    const columns = Number(columnsInput.value);
    const filename = sanitizeFilename(filenameInput.value);
    filenameInput.value = filename;
    const config = makeConfiguration(rows, columns, filename);
    const blob = new Blob([JSON.stringify(config, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);

    state.rows = rows;
    state.columns = columns;
    reset(false);
    record(`Configuration created and downloaded: ${filename} (${rows} × ${columns}, ${rows * columns} positions).`);
    render();
    fileStatus.className = "status success";
    fileStatus.textContent = `Created ${filename}. The canvas is initialized to an empty state.`;
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
      record("Sequence is complete. Press Reset to start again.", "condition");
      render();
      return;
    }

    let next = null;
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
    record(`array_elements = [${state.array_elements.join(",")}]`);
    if (state.array_elements.length === n) {
      record("Sequence complete: every position is occupied.", "condition");
    }
    render();
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
    if (state.array_elements.length === 0) {
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
      const gridRow = Math.floor(position / state.columns) + 1;
      const gridColumn = position % state.columns + 1;
      name.textContent = `Position ${position} (R${gridRow}, C${gridColumn})`;
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
    if (recent.length === 0) {
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
    document.querySelector("#canvas-description").textContent = `${state.rows} rows × ${state.columns} columns · ${n} positions`;
    generateButton.disabled = state.array_elements.length === n;
    generateButton.textContent = state.array_elements.length === n ? "Sequence Complete" : "Generate · Next State";
    renderCanvas();
    renderArrayList();
    renderLog();
  }

  function reset(logReset = true) {
    state.clickCount = 0;
    state.array_elements = [];
    state.currentCardinality = 0;
    state.log = [];
    if (logReset) record(`Reset. Empty ${state.rows} × ${state.columns} canvas; array_elements = [].`, "note");
    render();
  }

  rowsInput.addEventListener("input", updateConfigSummary);
  columnsInput.addEventListener("input", updateConfigSummary);
  configForm.addEventListener("submit", createFile);
  generateButton.addEventListener("click", advanceCycle);
  resetButton.addEventListener("click", () => reset());
  clearLogButton.addEventListener("click", () => {
    state.log = [];
    renderLog();
  });

  updateConfigSummary();
  reset();
})();
