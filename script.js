(() => {
  "use strict";

  const LIMIT = 4;
  const state = {
    clickCount: 0,
    nextId: 1,
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

  function activeArrayToProcess() {
    // Array 1 begins the cycle; subsequent arrays are handled by the same
    // exceed/return/comparison rules rather than a round-robin click counter.
    return state.arrays.find(array => array.id === 1) || state.arrays[0] || null;
  }

  function highestOtherPosition(array) {
    return state.arrays
      .filter(other => other.id !== array.id && other.position !== null)
      .reduce((highest, other) => Math.max(highest, other.position), -1);
  }

  function applyLessThanOrEqualRule(array) {
    record("Trigger: Less than or equal value.", "condition");
    const target = highestOtherPosition(array) + 1;
    if (target < LIMIT && !occupiedPositions(array.id).has(target)) {
      if (array.position !== target) moveArray(array, target);
      return true;
    }
    record(`Array ${array.id} exceeds the available comparison position.`, "condition");
    moveOutside(array);
    return false;
  }

  function settlePendingReturns() {
    // Newer pending arrays settle first into the remaining positions. Each
    // return then applies the same comparison rule, without overwriting tiles.
    let guard = 0;
    while (state.arrays.some(array => array.returnPending) && guard < LIMIT * (state.arrays.length + 2)) {
      guard += 1;
      const pending = state.arrays
        .filter(array => array.returnPending)
        .sort((a, b) => b.id - a.id);
      let progressed = false;

      for (const array of pending) {
        const free = firstFreePosition();
        if (free === null) continue;
        moveArray(array, free);
        record("Trigger: Return value.");
        progressed = true;

        if (!applyLessThanOrEqualRule(array)) {
          // If comparison exceeds the canvas, the array at the last position
          // also exceeds on this chain. Both become eligible to return.
          const lastPositionArrays = state.arrays.filter(
            other => other.id !== array.id && other.position === LIMIT - 1
          );
          lastPositionArrays.forEach(moveOutside);
          if (state.arrays.every(item => item.position === null)) {
            record("Condition: No array inside canvas.", "condition");
            record("Trigger: No array? Create.");
            createArray(0);
          }
        }
      }
      if (!progressed) break;
    }
  }

  function processExceed(array) {
    record("Trigger: Exceed value.", "condition");
    moveOutside(array);

    // On exceed, the other visible arrays advance too. Work from the right
    // edge inward so an array never overwrites the next occupied position.
    const others = state.arrays
      .filter(other => other.id !== array.id && other.position !== null)
      .sort((a, b) => b.position - a.position);
    others.forEach(other => {
      const next = other.position + 1;
      if (next >= LIMIT || occupiedPositions(other.id).has(next)) {
        moveOutside(other);
        record(`Array ${other.id} exceeds while advancing.`, "condition");
      } else {
        moveArray(other, next);
      }
    });

    if (state.arrays.every(item => item.position === null)) {
      record("Condition: No array inside canvas.", "condition");
      record("Trigger: No array? Create.");
      createArray(0);
    }

    settlePendingReturns();
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

    const array = activeArrayToProcess();
    if (!array) {
      render();
      return;
    }

    array.value += 1;
    record(`Array ${array.id} increments its value to ${array.value}.`);

    if (array.position === null) {
      record(`Array ${array.id} is outside; evaluate its return.`, "condition");
      array.returnPending = true;
      settlePendingReturns();
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
        processExceed(array);
      }
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