// app/components/DcCircuit.tsx
'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useProgress } from "@/app/lib/progress";

/**
 * DC Circuit Game (series resistors)
 * - Adjustable: V (volts), R1, R2, R3 (ohms)
 * - Computes total resistance, current, voltage drops
 * - Challenge: meet a random target current by tuning values
 */

function formatNum(n: number) {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1000) return n.toFixed(0);
  if (Math.abs(n) >= 1) return n.toFixed(2);
  return n.toFixed(4);
}

export default function DcCircuit() {
  // initial values
  const [V, setV] = useState(5); // volts
  const [R1, setR1] = useState(100); // ohms
  const [R2, setR2] = useState(100);
  const [R3, setR3] = useState(100);
  const [message, setMessage] = useState<string | null>(null);

  // challenge target current (A)
  const [target, setTarget] = useState<number>(() => {
    // reasonable target between 0.01 A and 0.25 A initially
    return +(0.05 + Math.random() * 0.2).toFixed(3);
  });

  // progress hook for ece_dc
  const { completeOnce } = useProgress("ece_dc");

  // derived values
  const totals = useMemo(() => {
    const Rtot = Math.max(0.0001, R1 + R2 + R3);
    const I = V / Rtot;
    const V1 = I * R1;
    const V2 = I * R2;
    const V3 = I * R3;
    return { Rtot, I, V1, V2, V3 };
  }, [V, R1, R2, R3]);

  useEffect(() => {
    setMessage(null);
  }, [V, R1, R2, R3]);

  function randomizeChallenge() {
    // choose random reasonable V and resistances so target is reachable
    const v = [3, 5, 9, 12][Math.floor(Math.random() * 4)];
    setV(v);
    // pick resistances so current near 0.01..0.5
    setR1( Math.round(20 + Math.random() * 300) );
    setR2( Math.round(20 + Math.random() * 300) );
    setR3( Math.round(20 + Math.random() * 300) );

    // recompute target after small delay for state to update
    setTimeout(() => {
      const r = (R1 + R2 + R3) || 200;
      const Iguess = v / r;
      // make target in range around Iguess
      const factor = 0.6 + Math.random() * 1.2;
      const t = +(Math.max(0.001, Iguess * factor)).toFixed(4);
      setTarget(t);
    }, 50);
  }

  function checkAnswer() {
    const I = totals.I;
    const tol = 0.05; // 5%
    if (!isFinite(I)) {
      setMessage("Invalid values. Check resistances and voltage.");
      return;
    }
    const diff = Math.abs(I - target);
    if (diff <= Math.abs(target) * tol) {
      setMessage(`✅ Success! Current = ${formatNum(I)} A (target ${target} A)`);
      completeOnce(3, 50);
    } else {
      setMessage(`❌ Not yet. Current = ${formatNum(I)} A; target = ${target} A. Try lowering resistances or increasing voltage.`);
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2>DC Series Circuit — Challenge Mode</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ minWidth: 220 }}>
          <div style={{ marginBottom: 8, color: "#333", fontWeight: 700 }}>Source Voltage (V)</div>
          <input type="range" min={1} max={20} step={0.5} value={V} onChange={(e) => setV(Number(e.target.value))} />
          <div style={{ marginTop: 6 }}>{V.toFixed(1)} V</div>
        </div>

        <div style={{ minWidth: 220 }}>
          <div style={{ marginBottom: 8, color: "#333", fontWeight: 700 }}>R1 (Ω)</div>
          <input type="range" min={1} max={1000} step={1} value={R1} onChange={(e) => setR1(Number(e.target.value))} />
          <div style={{ marginTop: 6 }}>{R1} Ω</div>
        </div>

        <div style={{ minWidth: 220 }}>
          <div style={{ marginBottom: 8, color: "#333", fontWeight: 700 }}>R2 (Ω)</div>
          <input type="range" min={1} max={1000} step={1} value={R2} onChange={(e) => setR2(Number(e.target.value))} />
          <div style={{ marginTop: 6 }}>{R2} Ω</div>
        </div>

        <div style={{ minWidth: 220 }}>
          <div style={{ marginBottom: 8, color: "#333", fontWeight: 700 }}>R3 (Ω)</div>
          <input type="range" min={1} max={1000} step={1} value={R3} onChange={(e) => setR3(Number(e.target.value))} />
          <div style={{ marginTop: 6 }}>{R3} Ω</div>
        </div>
      </div>

      {/* schematic */}
      <div style={{ border: "2px dashed #bbb", borderRadius: 10, padding: 12, background: "#fff9f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="380" height="120" viewBox="0 0 380 120" style={{ flex: "0 0 380px" }}>
            {/* left wire */}
            <line x1="10" y1="60" x2="60" y2="60" stroke="#333" strokeWidth={3} />
            {/* battery (simple) */}
            <rect x="60" y="40" width="18" height="40" fill="#ffd54f" stroke="#b38600" />
            <rect x="82" y="46" width="6" height="28" fill="#fff176" stroke="#b38600" />
            <text x="60" y="36" fontSize="12" fill="#333">V</text>

            {/* wire to R1 */}
            <line x1="88" y1="60" x2="140" y2="60" stroke="#333" strokeWidth={3} />

            {/* R1 box */}
            <rect x="140" y="42" width="48" height="36" rx="6" ry="6" fill="#1a73e8" stroke="#0d47a1" />
            <text x="164" y="66" fontSize="16" fontWeight="700" fill="black" textAnchor="middle">{R1}</text>

            {/* wire to R2 */}
            <line x1="188" y1="60" x2="240" y2="60" stroke="#333" strokeWidth={3} />

            {/* R2 box */}
            <rect x="240" y="42" width="48" height="36" rx="6" ry="6" fill="#1a73e8" stroke="#0d47a1" />
            <text x="264" y="66" fontSize="16" fontWeight="700" fill="black" textAnchor="middle">{R2}</text>

            {/* wire to R3 */}
            <line x1="288" y1="60" x2="340" y2="60" stroke="#333" strokeWidth={3} />

            {/* R3 box */}
            <rect x="340" y="42" width="48" height="36" rx="6" ry="6" fill="#1a73e8" stroke="#0d47a1" />
            <text x="364" y="66" fontSize="16" fontWeight="700" fill="black" textAnchor="middle">{R3}</text>

            {/* right wire back to battery */}
            <line x1="388" y1="60" x2="380" y2="60" stroke="#333" strokeWidth={3} />
          </svg>

          <div style={{ display: "grid", gap: 6, color: "black", fontWeight: 600 }}>
            <div>Total R: {formatNum(totals.Rtot)} Ω</div>
            <div>Current I: {formatNum(totals.I)} A</div>
            <div>V drops: R1: {formatNum(totals.V1)} V &nbsp; R2: {formatNum(totals.V2)} V &nbsp; R3: {formatNum(totals.V3)} V</div>

            <div style={{ marginTop: 8, padding: 8, borderRadius: 8, background: "#f1f8ff", border: "1px solid #dceeff" }}>
              <div><b>Challenge target current:</b> <span style={{ color: "#0d47a1" }}>{target} A</span></div>
              <div style={{ marginTop: 6, color: "#555", fontSize: 13 }}>Try to tune V, R1, R2, R3 to match the target current within ±5%.</div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={checkAnswer} style={{ padding: "8px 12px", borderRadius: 8, background: "#1a73e8", color: "white", border: "none", fontWeight: 700 }}>Check</button>
              <button onClick={() => setTarget(+(Math.max(0.001, (0.02 + Math.random() * 0.3))).toFixed(4))} style={{ padding: "8px 12px", borderRadius: 8, background: "#eee", border: "1px solid #ddd" }}>New Target</button>
              <button onClick={() => { setR1(100); setR2(100); setR3(100); setV(5); }} style={{ padding: "8px 12px", borderRadius: 8, background: "#fff3e0", border: "1px solid #f0c27a" }}>Reset Values</button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div style={{
          padding: 10,
          borderRadius: 8,
          background: message.startsWith('✅') ? "#e6f7ee" : "#fff3f3",
          border: message.startsWith('✅') ? "1px solid #bdeccb" : "1px solid #f3c2c2",
          color: "black",   // 👈 force black text
          fontWeight: 600,  // make it bold for visibility
        }}>
          {message}
        </div>
      )}

      <div style={{ color: "#666" }}>
        Tip: Lowering total resistance or increasing voltage increases current. Use the sliders to experiment and reach the challenge current.
      </div>
    </div>
  );
}
