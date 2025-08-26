'use client';

import { useMemo, useRef, useState } from "react";

/**
 * Drag & Drop Beam Balance Game
 *
 * - Drag a weight (1,2,3,5kg) from the palette onto the beam.
 * - It snaps to integer positions [-5..-1, 1..5]; 0 is the pivot (not allowed).
 * - Torque = mass * |position|.
 * - Balanced when sum(left torque) === sum(right torque).
 * - Click a placed weight to remove it.
 */

type Placed = {
  id: string;
  mass: number;   // kg
  pos: number;    // integer slot; negative = left of pivot, positive = right
};

const SLOTS = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]; // allowed positions (0 = pivot blocked)

export default function BeamBalanceGame() {
  // current placed weights
  const [items, setItems] = useState<Placed[]>([]);
  const beamRef = useRef<HTMLDivElement | null>(null);

  // palette weights
  const palette = [1, 2, 3, 5];

  // compute torques
  const { leftTorque, rightTorque, balanced } = useMemo(() => {
    const L = items
      .filter(w => w.pos < 0)
      .reduce((sum, w) => sum + w.mass * Math.abs(w.pos), 0);
    const R = items
      .filter(w => w.pos > 0)
      .reduce((sum, w) => sum + w.mass * Math.abs(w.pos), 0);
    return { leftTorque: L, rightTorque: R, balanced: L === R };
  }, [items]);

  // For a pretty tilt (visual only)
  const tiltDeg = Math.max(-12, Math.min(12, (rightTorque - leftTorque) / 5));

  function reset() {
    setItems([]);
  }

  function onDragStart(e: React.DragEvent<HTMLButtonElement>, mass: number) {
    e.dataTransfer.setData("text/plain", String(mass));
    e.dataTransfer.effectAllowed = "copy";
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    // required to allow drop
    e.preventDefault();
  }

  function snapToSlot(clientX: number) {
    const beam = beamRef.current;
    if (!beam) return null;

    const rect = beam.getBoundingClientRect();
    const x = clientX - rect.left;       // px from left edge
    const ratio = x / rect.width;        // 0..1
    const normalized = ratio * 2 - 1;    // -1..+1 with 0 at center
    // map to slots [-5..+5], skipping 0
    const approx = Math.round(normalized * 5); // -5..+5
    const snapped = approx === 0 ? (normalized >= 0 ? 1 : -1) : approx;
    // clamp to allowed range
    const clamped = Math.max(-5, Math.min(5, snapped));
    // if clamped is 0 (shouldn't be), nudge to ±1
    const finalPos = clamped === 0 ? 1 : clamped;
    return SLOTS.includes(finalPos) ? finalPos : null;
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const massText = e.dataTransfer.getData("text/plain");
    const mass = Number(massText);
    if (!mass || Number.isNaN(mass)) return;

    const slot = snapToSlot(e.clientX);
    if (slot == null) return;

    // If slot already occupied, replace it with the new one (or ignore).
    setItems(prev => {
      const without = prev.filter(p => p.pos !== slot);
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      return [...without, { id, mass, pos: slot }].sort((a, b) => a.pos - b.pos);
    });
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Torque Balance (Drag & Drop) ⚖️</h2>

      {/* palette */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "#555" }}>Drag a weight:</span>
        {palette.map(m => (
          <button
            key={m}
            draggable
            onDragStart={(e) => onDragStart(e, m)}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "grab",
              background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              userSelect: "none"
            }}
            title="Drag me onto the beam"
          >
            {m} kg
          </button>
        ))}
        <button onClick={reset} style={{ marginLeft: "auto" }}>
          Reset
        </button>
      </div>

      {/* beam area */}
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{
          height: 260,
          border: "2px dashed #bbb",
          borderRadius: 12,
          background: "#fafafa",
          position: "relative",
          padding: 12,
        }}
      >
        {/* pivot */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 12,
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: "30px solid #555",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        />

        {/* beam */}
        <div
          ref={beamRef}
          style={{
            position: "absolute",
            top: "40%",
            left: "10%",
            width: "80%",
            height: 8,
            background: balanced ? "#19a974" : "#e74c3c",
            transform: `rotate(${tiltDeg}deg)`,
            transformOrigin: "50% 50%",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
        >
          {/* slot ticks */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -16,
              transform: "translateX(-50%)",
              color: "#666",
              fontSize: 12
            }}
          >
            pivot
          </div>
          {SLOTS.map((slot) => (
            <div
              key={slot}
              style={{
                position: "absolute",
                left: `calc(50% + ${slot * 7.5}%)`, // 10 slots across ≈ 15% total span either side → 7.5% per slot
                top: -6,
                width: 2,
                height: 20,
                background: "#999",
                transform: "translateX(-1px)"
              }}
              title={`slot ${slot}`}
            />
          ))}

          {/* placed weights */}
          {items.map(w => (
            <button
              key={w.id}
              onClick={() => removeItem(w.id)}
              title="Click to remove"
              style={{
                position: "absolute",
                left: `calc(50% + ${w.pos * 7.5}%)`,
                top: -36,
                transform: "translateX(-20px)",
                width: 40,
                height: 28,
                lineHeight: "28px",
                textAlign: "center",
                borderRadius: 6,
                border: "1px solid #999",
                background: "#eee",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {w.mass}kg
            </button>
          ))}
        </div>
      </div>

      {/* feedback */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>
          {balanced ? "✅ Balanced!" : "❌ Not Balanced"}
        </div>
        <div style={{ marginLeft: "auto", color: "#555" }}>
          Left torque: <b>{leftTorque}</b> &nbsp; | &nbsp; Right torque: <b>{rightTorque}</b>
        </div>
      </div>

      <small style={{ color: "#666" }}>
        Tip: Torque = mass × distance. Try 5kg at −2 and 2kg at +5 → 10 vs 10 → Balanced.
      </small>
    </div>
  );
}
