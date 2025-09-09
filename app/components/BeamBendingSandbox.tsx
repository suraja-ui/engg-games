"use client";

import { useProgress } from "@/app/lib/progress";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Beam Bending Sandbox
 * - User sets force (F), length (L), and modulus (E, I)
 * - Shows deflection at center for a simply supported beam
 * - Score increases for correct answers
 */

export default function BeamBendingSandbox() {
  const { progress, completeOnce } = useProgress("mech_beams");
  const [F, setF] = useState(100); // Newtons
  const [L, setL] = useState(2); // meters
  const [E, setE] = useState(200); // GPa
  const [I, setI] = useState(5000); // cm^4
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  // Calculate deflection at center: δ = (F * L^3) / (48 * E * I)
  // E in GPa, I in cm^4, convert to SI: E [Pa], I [m^4]
  const deflection = useMemo(() => {
    const E_SI = E * 1e9; // GPa to Pa
    const I_SI = I * 1e-8; // cm^4 to m^4
    return (F * Math.pow(L, 3)) / (48 * E_SI * I_SI);
  }, [F, L, E, I]);

  function checkAnswer() {
    setMessage(`Deflection at center: ${deflection.toExponential(3)} m`);
    setScore((s) => s + 1);
  }

  function reset() {
    setF(100);
    setL(2);
    setE(200);
    setI(5000);
    setMessage("");
    setScore(0);
  }

  useEffect(() => {
    if (score >= 3) {
      completeOnce(3, 50); // 3 stars, 50 XP
    }
  }, [score, completeOnce]);

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 500, margin: "0 auto" }}>
      <h2>Beam Bending Sandbox</h2>
      <div style={{ fontSize: 16 }}>
        <b>F</b> = {F} N &nbsp; | &nbsp; <b>L</b> = {L} m &nbsp; | &nbsp; <b>E</b> = {E} GPa &nbsp; | &nbsp; <b>I</b> = {I} cm
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div>Force (F, N)</div>
          <input type="range" min={10} max={1000} step={10} value={F} onChange={e => setF(Number(e.target.value))} />
          <div>{F} N</div>
        </div>
        <div>
          <div>Length (L, m)</div>
          <input type="range" min={0.5} max={5} step={0.1} value={L} onChange={e => setL(Number(e.target.value))} />
          <div>{L} m</div>
        </div>
        <div>
          <div>Modulus (E, GPa)</div>
          <input type="range" min={50} max={300} step={5} value={E} onChange={e => setE(Number(e.target.value))} />
          <div>{E} GPa</div>
        </div>
        <div>
          <div>Moment of Inertia (I, cm)</div>
          <input type="range" min={1000} max={20000} step={100} value={I} onChange={e => setI(Number(e.target.value))} />
          <div>{I} cm</div>
        </div>
      </div>
      <button onClick={checkAnswer} style={btn}>Show Deflection</button>
      <button onClick={reset} style={{ ...btn, background: "#eee", color: "#333" }}>Reset</button>
      {message && <div style={{ padding: 10, borderRadius: 8, background: "#e6f7ee", border: "1px solid #bdeccb", color: "black", fontWeight: 600 }}>{message}</div>}
      <div style={{ color: "#666", fontSize: 14 }}>
        Tip: Try changing F, L, E, I to see how deflection changes. Lower E or I, or increase F or L, to increase deflection.
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "royalblue",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
};
