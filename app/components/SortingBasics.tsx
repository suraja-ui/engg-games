// app/components/SortingBasics.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * SortingBasics component
 * - Click "Add All Sorts" to add visualizers for Bubble, Selection, Insertion, Merge, Quick
 * - Each SortCard runs the algorithm as a sequence of steps (compare / swap)
 * - Controls: Play / Pause / Step / Reset
 */

type Step =
  | { type: "compare"; i: number; j: number }
  | { type: "swap"; i: number; j: number }
  | { type: "set"; i: number; value: number } // for merge writes

const ALGORITHMS = ["Bubble", "Selection", "Insertion", "Merge", "Quick"] as const;
type AlgName = (typeof ALGORITHMS)[number];

const MIN_DELAY = 60;   // ms (slowest)
const MAX_DELAY = 800;  // ms (fastest when inverted)

function randArray(n = 12, max = 100) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * max) + 5);
}

/* --- Step generators for algorithms --- */
/* Each returns { arr0, steps } where steps is an array of Step describing the algorithm actions. */

function bubbleSteps(arr0: number[]) {
  const arr = arr0.slice();
  const steps: Step[] = [];
  const n = arr.length;
  for (let pass = 0; pass < n - 1; pass++) {
    for (let i = 0; i < n - 1 - pass; i++) {
      steps.push({ type: "compare", i, j: i + 1 });
      if (arr[i] > arr[i + 1]) {
        steps.push({ type: "swap", i, j: i + 1 });
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
  }
  return { arr0, steps };
}

function selectionSteps(arr0: number[]) {
  const arr = arr0.slice();
  const steps: Step[] = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ type: "compare", i: minIdx, j });
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      steps.push({ type: "swap", i, j: minIdx });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return { arr0, steps };
}

function insertionSteps(arr0: number[]) {
  const arr = arr0.slice();
  const steps: Step[] = [];
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    steps.push({ type: "compare", i: j, j: i });
    while (j >= 0 && arr[j] > key) {
      steps.push({ type: "set", i: j + 1, value: arr[j] });
      arr[j + 1] = arr[j];
      j--;
      if (j >= 0) steps.push({ type: "compare", i: j, j: i });
    }
    steps.push({ type: "set", i: j + 1, value: key });
    arr[j + 1] = key;
  }
  return { arr0, steps };
}

function mergeSteps(arr0: number[]) {
  const arr = arr0.slice();
  const steps: Step[] = [];

  function mergeSort(l: number, r: number) {
    if (r - l <= 1) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(l, m);
    mergeSort(m, r);
    // merge [l,m) and [m,r)
    const temp: number[] = [];
    let i = l,
      j = m;
    while (i < m || j < r) {
      if (j >= r || (i < m && arr[i] <= arr[j])) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }
    // write back
    for (let k = 0; k < temp.length; k++) {
      steps.push({ type: "set", i: l + k, value: temp[k] });
      arr[l + k] = temp[k];
    }
  }

  mergeSort(0, arr.length);
  return { arr0, steps };
}

function quickSteps(arr0: number[]) {
  const arr = arr0.slice();
  const steps: Step[] = [];

  function qsort(l: number, r: number) {
    if (l >= r) return;
    const pivot = arr[Math.floor((l + r) / 2)];
    let i = l,
      j = r;
    while (i <= j) {
      while (arr[i] < pivot) {
        steps.push({ type: "compare", i, j: Math.floor((l + r) / 2) });
        i++;
      }
      while (arr[j] > pivot) {
        steps.push({ type: "compare", i: Math.floor((l + r) / 2), j });
        j--;
      }
      if (i <= j) {
        steps.push({ type: "swap", i, j });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;
      }
    }
    if (l < j) qsort(l, j);
    if (i < r) qsort(i, r);
  }

  qsort(0, arr.length - 1);
  return { arr0, steps };
}

/* ---- SortCard: shows a visualizer for one algorithm ---- */
function SortCard({ name, seed }: { name: AlgName; seed?: number }) {
  const initial = useMemo(() => {
    const a = randArray(12, 120);
    return a;
  }, [seed]);

  const [arr, setArr] = useState<number[]>(initial.slice());
  const [steps, setSteps] = useState<Step[]>([]);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const speedRef = useRef(300);

  useEffect(() => {
    // generate steps for selected algorithm
    let out;
    if (name === "Bubble") out = bubbleSteps(initial);
    else if (name === "Selection") out = selectionSteps(initial);
    else if (name === "Insertion") out = insertionSteps(initial);
    else if (name === "Merge") out = mergeSteps(initial);
    else out = quickSteps(initial);

    setArr(initial.slice());
    setSteps(out.steps);
    setPos(0);
    setPlaying(false);
  }, [name, initial]);

  useEffect(() => {
    let timer: any = null;
    if (playing && pos < steps.length) {
      timer = setTimeout(() => {
        stepForward();
      }, speedRef.current);
    } else if (pos >= steps.length) {
      setPlaying(false);
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, pos, steps]);

  function stepForward() {
    if (pos >= steps.length) return;
    const s = steps[pos];
    setArr((prev) => {
      const copy = prev.slice();
      if (s.type === "compare") {
        // no data change, but we keep the step index for highlighting
      } else if (s.type === "swap") {
        const tmp = copy[s.i];
        copy[s.i] = copy[s.j];
        copy[s.j] = tmp;
      } else if (s.type === "set") {
        copy[s.i] = (s as any).value;
      }
      return copy;
    });
    setPos((p) => p + 1);
  }

  function stepBackward() {
    // for simplicity we reset and replay to pos-1 (simple but slower)
    const newPos = Math.max(0, pos - 1);
    // To support backward step properly we'd need to store arr snapshots; instead, rebuild arr from initial and replay newPos steps
    const base = initial.slice();
    for (let i = 0; i < newPos; i++) {
      const s = steps[i];
      if (s.type === "swap") {
        const tmp = base[s.i];
        base[s.i] = base[s.j];
        base[s.j] = tmp;
      } else if (s.type === "set") {
        (base as any)[s.i] = (s as any).value;
      }
    }
    setArr(base);
    setPos(newPos);
    setPlaying(false);
  }

  function resetAll() {
    setArr(initial.slice());
    setPos(0);
    setPlaying(false);
  }

  const highlighted = pos < steps.length ? steps[pos] : null;

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 10,
      padding: 12,
      background: "#fff",
      boxShadow: "0 3px 8px rgba(0,0,0,0.03)",
      minWidth: 320
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <strong>{name} Sort</strong>
        <div style={{ marginLeft: "auto", color: "#666" }}>steps: {steps.length}</div>
      </div>

      {/* bar view */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120, marginBottom: 8 }}>
        {arr.map((v, i) => {
          const isCompare = highlighted && highlighted.type === "compare" && (highlighted as any).i === i || highlighted && highlighted.type === "compare" && (highlighted as any).j === i;
          const isSwap = highlighted && highlighted.type === "swap" && (((highlighted as any).i === i) || ((highlighted as any).j === i));
          const baseColor = "#1a73e8";
          const color = isSwap ? "#ff7043" : isCompare ? "#ffd54f" : baseColor;
          return (
            <div key={i} style={{
              width: 22,
              height: Math.max(12, v),
              background: color,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              borderRadius: 6,
              boxShadow: "inset 0 -4px rgba(0,0,0,0.08)",
              color: "black",
              fontWeight: 700,
              fontSize: 12,
            }}>
              <div style={{ paddingBottom: 6 }}>{v}</div>
            </div>
          );
        })}
      </div>

      {/* controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={playing ? pauseBtn : playBtn}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          onClick={() => { stepForward(); setPlaying(false); }}
          style={stepBtn}
        >
          Step
        </button>

        <button
          onClick={() => { stepBackward(); }}
          style={backBtn}
        >
          Back
        </button>

        <button
          onClick={resetAll}
          style={resetBtn}
        >
          Reset
        </button>

        <label style={{ marginLeft: "auto", color: "#333", fontSize: 13 }}>
          Speed (higher = faster)
          <input
            type="range"
            min={MIN_DELAY}
            max={MAX_DELAY}
            defaultValue={Math.round((MIN_DELAY + MAX_DELAY) / 2)}
            onChange={(e) => {
              const v = Number(e.target.value);
              // invert slider so larger value -> smaller delay -> faster
              speedRef.current = (MIN_DELAY + MAX_DELAY) - v;
            }}
            style={{ marginLeft: 8, verticalAlign: "middle" }}
          />
        </label>
      </div>

    </div>
  );
}

/* ---- Main component that can add all sorts ---- */
export default function SortingBasics() {
  const [cards, setCards] = useState<AlgName[]>([]);

  function addAll() {
    setCards((c) => {
      // ensure we only add once - keep existing and add missing ones
      const newList = [...c];
      for (const a of ALGORITHMS) {
        if (!newList.includes(a)) newList.push(a);
      }
      return newList;
    });
  }

  function addOne(name: AlgName) {
    setCards((c) => (c.includes(name) ? c : [...c, name]));
  }

  function resetAllCards() {
    setCards([]);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Sorting Basics</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button style={bubbleBtn} onClick={() => addOne("Bubble")}>Bubble Sort</button>
        <button style={selectionBtn} onClick={() => addOne("Selection")}>Selection Sort</button>
        <button style={insertionBtn} onClick={() => addOne("Insertion")}>Insertion Sort</button>
        <button style={mergeBtn} onClick={() => addOne("Merge")}>Merge Sort</button>
        <button style={quickBtn} onClick={() => addOne("Quick")}>Quick Sort</button>
        <button style={heapBtn} disabled>Heap Sort</button>
      </div>
      <button onClick={addAll} style={{ padding: "8px 12px", borderRadius: 8, background: "#1a73e8", color: "white", fontWeight: 700, marginTop: 8 }}>Add All Sorts</button>
      <button onClick={resetAllCards} style={{ marginLeft: 8, padding: "8px 10px", borderRadius: 8 }}>Clear</button>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        {cards.map((name) => <SortCard key={name} name={name} />)}
      </div>

      <div style={{ color: "#666" }}>
        Tip: Click "Add All Sorts" to load all algorithms at once. Use Play / Step to follow each algorithm's behavior and learn how they rearrange the array.
      </div>
    </div>
  );
}

const controlBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const baseBtn: React.CSSProperties = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  color: "white",
  cursor: "pointer",
};

const bubbleBtn: React.CSSProperties = { ...baseBtn, background: "#1E90FF" };
const selectionBtn: React.CSSProperties = { ...baseBtn, background: "#28A745" };
const insertionBtn: React.CSSProperties = { ...baseBtn, background: "#6F42C1" };
const mergeBtn: React.CSSProperties = { ...baseBtn, background: "#FD7E14" };
const quickBtn: React.CSSProperties = { ...baseBtn, background: "#DC3545" };
const heapBtn: React.CSSProperties = { ...baseBtn, background: "#FFC107", color: "black" }; // yellow needs dark text

/* button styles for sorting controls */
const baseControlBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

/* primary action (Play) - green */
export const playBtn: React.CSSProperties = {
  ...baseControlBtn,
  background: "#28A745",
  color: "white",
  border: "1px solid #238636",
};

/* pause (when playing) - gray */
export const pauseBtn: React.CSSProperties = {
  ...baseControlBtn,
  background: "#6C757D",
  color: "white",
  border: "1px solid #5a6268",
};

/* step - teal */
export const stepBtn: React.CSSProperties = {
  ...baseControlBtn,
  background: "#17A2B8",
  color: "white",
  border: "1px solid #138496",
};

/* back - coral/orange */
export const backBtn: React.CSSProperties = {
  ...baseControlBtn,
  background: "#FF7F50",
  color: "white",
  border: "1px solid #e06b38",
};

/* reset - red */
export const resetBtn: React.CSSProperties = {
  ...baseControlBtn,
  background: "#DC3545",
  color: "white",
  border: "1px solid #c82333",
};
