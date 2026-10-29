(() => {
  "use strict";

  const LIMIT = 4;
  const state = {
    clickCount: 0,
    nextId: 1,
    nextTurnId: 1,
    arrays: [],
    log: []
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

  function record(message, kind = "action") {
    state.log.push({ message, kind, click: state.clickCount });
  }

  function occupiedPositions(exceptId = null) {
    return new Set(
      state.arrays
        .filter(array => array.position !== null && array.id !== exceptId)
        .map(array => array.position)
    );
  }

  function firstFreePosition() {
    const occupied = occupiedPositions();
    for (let position = 0; position < LIMIT; position += 1) {
      if (!occupied.has(position)) return position;
    }
    return null;
  }

  function createArray(position = null) {
    const array = {
      id: state.nextId++,
      value: 0,
      position,
      returnPending: position === null
    };
    state.arrays.push(array);
    record(`Array ${array.id} created.`);
    if (position !== null) {
      record(`Array ${array.id} positions its color at canvas position ${position}.`);
    }
    return array;
  }

  function moveArray(array, position) {
    const previous = array.position;
    array.position = position;
    array.returnPending = false;
    const origin = previous === null ? "outside the canvas" : `position ${previous}`;
    record(`Array ${array.id} moves from ${origin} to canvas position ${position}.`);
  }

  function moveOutside(array) {
    if (array.position === null) return;
    const previous = array.position;
    array.position = null;
    array.returnPending = true;
    record(`Array ${array.id} moves its color from position ${previous} outside the canvas.`);
  }

  function returnPendingArrays() {
    const pending = state.arrays
      .filter(array => array.returnPending)
      .sort((a, b) => a.id - b.id);

    if (pending.length === 0) return;
    record("Trigger: Return value.");

    pending.forEach(array => {
      const free = firstFreePosition();
      if (free === null) {
        record(`Array ${array.id} remains outside: no canvas position is free.`, "condition");
        return;
      }
      moveArray(array, free);
      record("Trigger: Less than or equal value.");
    });
  }

  function nextArrayToProcess() {
    if (state.arrays.length === 0) return null;

    // Round-robin scheduling: every array uses the same rules.
    const ordered = [...state.arrays].sort((a, b) => a.id - b.id);
    let selected = ordered.find(array => array.id >= state.nextTurnId);
    if (!selected) selected = ordered[0];
    state.nextTurnId = selected.id + 1;
    return selected;
  }

  function advanceCycle() {
    state.clickCount += 1;
    record(`User clicks Generate (click ${state.clickCount}).`, "note");

    if (state.arrays.length === 0 || state.arrays.every(array => array.position === null)) {
      record("Condition: No array inside canvas.", "condition");
      record("Trigger: No array? Create.");
      createArray(firstFreePosition() ?? 0);
      render();
      return;
    }

    const array = nextArrayToProcess();
    if (!array) {
      render();
      return;
    }

    array.value += 1;
    record(`Array ${array.id} increments its value to ${array.value}.`);

    if (array.position === null) {
      record(`Array ${array.id} is outside; evaluate its return.`, "condition");
      const free = firstFreePosition();
      if (free === null) {
        record(`Array ${array.id} remains outside: no canvas position is free.`, "condition");
        array.returnPending = true;
      } else {
        moveArray(array, free);
        record("Trigger: Less than or equal value.");
      }
    } else {
      const next = array.position + 1;
      const occupied = occupiedPositions(array.id);
      if (next < LIMIT && !occupied.has(next)) {
        moveArray(array, next);
      } else {
        record(
          next >= LIMIT
            ? `Condition: Array ${array.id} exceeds the final position.`
            : `Condition: position ${next} is occupied.`,
          "condition"
        );
        moveOutside(array);
        record("Trigger: Exceed value.");
      }
    }

    // Returns are processed after the current array's movement. Occupied
    // positions are never overwritten, and the cycle driver is never fixed
    // to Array 1.
    returnPendingArrays();

    if (state.arrays.every(item => item.position === null)) {
      record("Condition: No array inside canvas.", "condition");
      record("Trigger: No array? Create.");
      createArray(0);
    }

    render();
  }

  function renderCanvas() {
    grid.replaceChildren();
    for (let position = 0; position < LIMIT; position += 1) {
      const occupant = state.arrays.find(array => array.position === position);
      const cell = document.createElement("div");
      cell.className = `canvas-cell ${occupant ? "occupied" : "empty"}`;
      cell.dataset.position = String(position);

      const positionLabel = document.createElement("span");
      positionLabel.className = "position";
      positionLabel.textContent = String(position);
      const occupantLabel = document.createElement("span");
      occupantLabel.className = "occupant";
      occupantLabel.textContent = occupant ? `Array ${occupant.id}` : "White · Empty";
      cell.append(positionLabel, occupantLabel);

      if (occupant) {
        const valueLabel = document.createElement("span");
        valueLabel.className = "value";
        valueLabel.textContent = `Value: ${occupant.value}`;
        cell.append(valueLabel);
      }
      grid.append(cell);
    }
  }

  function renderArrayList() {
    if (state.arrays.length === 0) {
      arrayList.innerHTML = '<p class="muted">No arrays created yet.</p>';
      return;
    }

    arrayList.replaceChildren();
    [...state.arrays].sort((a, b) => a.id - b.id).forEach(array => {
      const row = document.createElement("div");
      row.className = "array-row";
      const name = document.createElement("strong");
      name.textContent = `Array ${array.id}`;
      const detail = document.createElement("span");
      detail.className = "detail";
      detail.textContent = `Value: ${array.value} · ${array.position === null ? "Outside" : `Position ${array.position}`}${array.returnPending ? " · Return pending" : ""}`;
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
    clickCounter.textContent = `Click ${state.clickCount}`;
    arrayCount.textContent = String(state.arrays.length);
    visibleCount.textContent = `${state.arrays.filter(array => array.position !== null).length} / ${LIMIT}`;
    outsideCount.textContent = String(state.arrays.filter(array => array.position === null).length);
    renderCanvas();
    renderArrayList();
    renderLog();
  }

  function reset() {
    state.clickCount = 0;
    state.nextId = 1;
    state.nextTurnId = 1;
    state.arrays = [];
    state.log = [{ message: "Ready. Canvas is empty.", kind: "note", click: 0 }];
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