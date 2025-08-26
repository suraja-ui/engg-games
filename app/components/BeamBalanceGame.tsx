'use client';

import { useState } from "react";

/**
 * Simple Builder Game:
 * - A beam is balanced on a pivot (at center).
 * - User can place weights at positions left or right.
 * - Torque = weight × distance.
 * - Game says "Balanced" if total left torque == total right torque.
 */

type Weight = { id: number; mass: number; pos: number }; 
// pos is distance from pivot (negative = left, positive = right)

export default function BeamBalanceGame() {
  const [weights, setWeights] = useState<Weight[]>([]);
  const available = [1, 2, 3, 5]; // kg options

  function addWeight(mass: number, pos: number) {
    const id = Date.now() + Math.random();
    setWeights((prev) => [...prev, { id, mass, pos }]);
  }

  function reset() {
    setWeights([]);
  }

  const leftTorque = weights
    .filter((w) => w.pos < 0)
    .reduce((sum, w) => sum + w.mass * Math.abs(w.pos), 0);

  const rightTorque = weights
    .filter((w) => w.pos > 0)
    .reduce((sum, w) => sum + w.mass * Math.abs(w.pos), 0);

  const balanced = leftTorque === rightTorque;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Torque Balance Game ⚖️</h2>

      {/* available weights */}
      <div style={{ display: "flex", gap: 8 }}>
        {available.map((m) => (
          <button
            key={m}
            onClick={() => addWeight(m, Math.random() < 0.5 ? -1 : 1)}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {m}kg
          </button>
        ))}
        <button onClick={reset} style={{ marginLeft: "auto" }}>
          Reset
        </button>
      </div>

      {/* beam visualization */}
      <div
        style={{
          height: 200,
          border: "2px dashed #bbb",
          borderRadius: 12,
          background: "#fafafa",
          position: "relative",
        }}
      >
        {/* pivot */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: "30px solid #555",
          }}
        />
        {/* beam */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "10%",
            width: "80%",
            height: 6,
            background: balanced ? "green" : "red",
            transform: `rotate(${(rightTorque - leftTorque) / 50}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          {/* weights */}
          {weights.map((w) => (
            <div
              key={w.id}
              style={{
                position: "absolute",
                left: w.pos < 0 ? `calc(50% - ${Math.abs(w.pos) * 40}px)` : `calc(50% + ${w.pos * 40}px)`,
                top: -30,
                width: 40,
                height: 30,
                background: "#ddd",
                border: "1px solid #999",
                textAlign: "center",
                lineHeight: "30px",
                borderRadius: 6,
              }}
            >
              {w.mass}kg
            </div>
          ))}
        </div>
      </div>

      {/* feedback */}
      <div style={{ fontWeight: 700 }}>
        {balanced ? "✅ Balanced!" : "❌ Not Balanced"}
      </div>
    </div>
  );
}
