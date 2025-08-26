
'use client';

import { useProgress } from "@/app/lib/progress";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * RLC series sandbox
 * Step input: V = 5V
 * State vars:
 *  - i(t): current through series branch
 *  - vC(t): capacitor voltage (we plot this)
 * Equations:
 *  L di/dt + R i + vC = V
 *  dvC/dt = i / C
 * Simple explicit Euler integration for intuition-friendly visuals.
 */

type SimPoint = { t: number; vC: number; i: number };


export default function RlcSandbox() {
  const { completeOnce } = useProgress("ece_rlc");
  // Sliders (UI units are user-friendly; convert to SI for math)
  const [R, setR] = useState(100);   // ohms
  const [L, setL] = useState(10);    // mH (milliHenries)
  const [C, setC] = useState(100);   // uF (microFarads)
  const [duration, setDuration] = useState(0.05); // seconds to simulate
  const Vstep = 5;

  const data: SimPoint[] = useMemo(() => {
    const L_SI = L / 1000;     // mH -> H
    const C_SI = C / 1_000_000; // uF -> F
    const dt = duration / 600;  // 600 sample points for smooth graph
    let t = 0;
    let i = 0;     // A
    let vC = 0;    // V

    const points: SimPoint[] = [{ t, vC, i }];
    for (let n = 0; n < 600; n++) {
      // di/dt = (V - R i - vC)/L
      const di_dt = L_SI > 0 ? (Vstep - R * i - vC) / L_SI : 0;
      // dvC/dt = i / C
      const dvC_dt = C_SI > 0 ? i / C_SI : 0;

      // Euler step
      i = i + di_dt * dt;
      vC = vC + dvC_dt * dt;
      t = t + dt;

      // clamp numerical drift a bit
      if (!Number.isFinite(i)) i = 0;
      if (!Number.isFinite(vC)) vC = 0;

      points.push({ t, vC, i });
    }
    return points;
  }, [R, L, C, duration]);

  useEffect(() => {
    if (!data.length) return;
    const last = data[data.length - 1];
    const closeToFive = Math.abs(last.vC - 5) <= 0.1;
    if (closeToFive) {
      completeOnce(3, 50);
    }
  }, [data, completeOnce]);

  // draw to <canvas>
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);

    // padding for axes
    const padL = 48, padR = 8, padT = 16, padB = 28;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // find ranges
    const tMin = 0, tMax = data[data.length - 1].t;
    const vMin = Math.min(0, ...data.map(d => d.vC));
    const vMax = Math.max(Vstep, ...data.map(d => d.vC));

    function x(t: number) { return padL + (t - tMin) * (plotW / (tMax - tMin)); }
    function y(v: number) { return padT + (vMax - v) * (plotH / (vMax - vMin)); }

    // axes
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // labels
    ctx.fillStyle = "#666";
    ctx.font = "12px system-ui";
    ctx.fillText("time (s)", padL + plotW - 48, padT + plotH + 18);
    ctx.fillText("Vcap (V)", 6, padT + 12);
    ctx.fillText(`R=${R}Ω  L=${L}mH  C=${C}µF`, padL, 14);

    // step target line (V=5V)
    ctx.strokeStyle = "#bbb";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, y(Vstep));
    ctx.lineTo(padL + plotW, y(Vstep));
    ctx.stroke();
    ctx.setLineDash([]);

    // waveform: vC(t)
    ctx.strokeStyle = "#2a6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((p, idx) => {
      const px = x(p.t);
      const py = y(p.vC);
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // tick marks (x)
    ctx.fillStyle = "#555";
    const ticks = 6;
    for (let k = 0; k <= ticks; k++) {
      const tt = tMin + (k * (tMax - tMin)) / ticks;
      const tx = x(tt);
      ctx.fillRect(tx, padT + plotH, 1, 4);
      const label = tt.toFixed(3);
      ctx.fillText(label, tx - 12, padT + plotH + 18);
    }
  }, [data, R, L, C]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* controls */}
      <div style={{ display: "grid", gap: 8 }}>
        <Slider label={`R = ${R} Ω`} min={1} max={1000} value={R} onChange={setR} />
        <Slider label={`L = ${L} mH`} min={1} max={200} value={L} onChange={setL} />
        <Slider label={`C = ${C} µF`} min={1} max={1000} value={C} onChange={setC} />
        <Slider label={`Duration = ${duration.toFixed(3)} s`} min={0.005} max={0.2} step={0.005} value={duration} onChange={setDuration} />
      </div>

      {/* canvas graph */}
      <div style={{ border: "2px dashed #bbb", borderRadius: 12, background: "#fafafa", padding: 12 }}>
        <canvas ref={canvasRef} width={800} height={300} style={{ width: "100%", display: "block" }} />
      </div>

      <small style={{ color: "#666" }}>
        Try: low R + small L + medium C → fast rise with little overshoot.  
        Lower damping (small R, big L, small C) → ringing (oscillation).
      </small>
    </div>
  );
}

/** Reusable slider row */
function Slider(props: {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "grid", gridTemplateColumns: "140px 1fr 64px", gap: 10, alignItems: "center" }}>
      <span style={{ whiteSpace: "nowrap" }}>{props.label}</span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
      <span style={{ textAlign: "right", color: "#333" }} />
    </label>
  );
}
