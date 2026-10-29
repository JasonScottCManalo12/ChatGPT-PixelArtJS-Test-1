(() => {
  "use strict";

  const LIMIT = 4;
  // Exact occupied-position sequence supplied by the user.
  const ARRAY_ELEMENT_SEQUENCE = [
    [], [0], [1], [2], [3],
    [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3],
    [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3],
    [0, 1, 2, 3]
  ];

  const state = { clickCount: 0, array_elements: [], log: [] };
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

  function record(message, kind = "action") {
    state.log.push({ message, kind, click: state.clickCount });
  }

  function applySequenceStep() {
    state.array_elements = [...ARRAY_ELEMENT_SEQUENCE[state.clickCount]];
    record(`array_elements = [${state.array_elements.join(",")}]`);
    if (state.clickCount === ARRAY_ELEMENT_SEQUENCE.length - 1) {
      record("Sequence complete: all four positions are occupied.", "condition");
    }
  }

  function advanceCycle() {
    if (state.clickCount >= ARRAY_ELEMENT_SEQUENCE.length - 1) {
      record("Sequence is complete. Press Reset to start again.", "condition");
      render();
      return;
    }
    state.clickCount += 1;
    applySequenceStep();
    render();
  }

  function renderCanvas() {
    const occupied = new Set(state.array_elements);
    grid.replaceChildren();
    for (let position = 0; position < LIMIT; position += 1) {
      const isOccupied = occupied.has(position);
      const cell = document.createElement("div");
      cell.className = `canvas-cell ${isOccupied ? "occupied" : "empty"}`;
      cell.dataset.position = String(position);
      const positionLabel = document.createElement("span");
      positionLabel.className = "position";
      positionLabel.textContent = String(position);
      const occupantLabel = document.createElement("span");
      occupantLabel.className = "occupant";
      occupantLabel.textContent = isOccupied ? `Array element ${position}` : "White · Empty";
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
      name.textContent = `Position ${position}`;
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
      item.textContent = entry.click ? `[Click ${entry.click}] ${entry.message}` : entry.message;
      eventLog.append(item);
    });
  }

  function render() {
    clickCounter.textContent = `Step ${state.clickCount} / ${ARRAY_ELEMENT_SEQUENCE.length - 1}`;
    arrayCount.textContent = String(state.array_elements.length);
    visibleCount.textContent = `${state.array_elements.length} / ${LIMIT}`;
    outsideCount.textContent = String(LIMIT - state.array_elements.length);
    renderCanvas();
    renderArrayList();
    renderLog();
  }

  function reset() {
    state.clickCount = 0;
    state.array_elements = [];
    state.log = [{ message: "Ready. array_elements = [].", kind: "note", click: 0 }];
    render();
  }

  generateButton.addEventListener("click", advanceCycle);
  resetButton.addEventListener("click", reset);
  clearLogButton.addEventListener("click", () => {
    state.log = [];
    renderLog();
  });

  reset();
})();