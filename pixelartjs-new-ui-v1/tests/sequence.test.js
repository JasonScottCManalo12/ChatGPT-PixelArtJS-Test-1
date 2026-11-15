const test = require('node:test');
const assert = require('node:assert/strict');

function nextCombination(values, n) {
  const a = values.slice();
  const k = a.length;
  for (let i = k - 1; i >= 0; i--) {
    if (a[i] < n - k + i) {
      a[i]++;
      for (let j = i + 1; j < k; j++) a[j] = a[j - 1] + 1;
      return a;
    }
  }
  return null;
}

function sequence(n) {
  const out = [[]];
  for (let k = 1; k <= n; k++) {
    let a = Array.from({ length: k }, (_, i) => i);
    while (a) {
      out.push(a);
      a = nextCombination(a, n);
    }
  }
  return out;
}

function compareLexicographically(a, b) {
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

function assertSequenceInvariants(n) {
  const states = sequence(n);
  assert.equal(states.length, 2 ** n, `all occupancy states for n=${n}`);
  assert.equal(new Set(states.map(state => state.join(','))).size, states.length,
    `no duplicate states for n=${n}`);
  assert.deepEqual(states[0], [], 'empty state is first');
  assert.deepEqual(states.at(-1), Array.from({ length: n }, (_, i) => i),
    'fully occupied state is last');

  for (let i = 1; i < states.length; i++) {
    assert.ok(states[i].length >= states[i - 1].length,
      'occupied-cell cardinality never decreases');
    if (states[i].length === states[i - 1].length) {
      assert.ok(compareLexicographically(states[i - 1], states[i]) < 0,
        'states within a cardinality group are lexicographically increasing');
    }
  }
}

test('1-position sequence includes empty and full states', () => {
  assert.deepEqual(sequence(1), [[], [0]]);
});

test('3-position sequence follows cardinality then lexicographic order', () => {
  assert.deepEqual(sequence(3), [
    [], [0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]
  ]);
});

test('sequence invariants hold exhaustively for 5 positions', () => {
  assertSequenceInvariants(5);
});

test('sequence invariants hold exhaustively for 10 positions (1,024 states)', () => {
  assertSequenceInvariants(10);
});

test('the final combination has no successor', () => {
  assert.equal(nextCombination([2, 3], 4), null);
});

test('a 10,000-position grid advances correctly at the first and final boundaries', () => {
  const first = Array.from({ length: 9_999 }, (_, i) => i);
  const next = nextCombination(first, 10_000);
  assert.deepEqual(next, [...Array.from({ length: 9_998 }, (_, i) => i), 9_999]);

  const full = Array.from({ length: 10_000 }, (_, i) => i);
  assert.equal(nextCombination(full, 10_000), null);
});
