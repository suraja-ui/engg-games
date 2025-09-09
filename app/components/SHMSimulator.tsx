// app/components/SHMSimulator.tsx
'use client';

import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@/app/lib/progress";

/**
 * SHMSimulator.tsx
 * - mass-spring-damper with damping optional
 * - RK4 integrator for stable simulation
 * - animated SVG mass + spring and canvas plot of displacement vs time
 * - Challenge: match a small target max amplitude (mm) to mark progress
 */

// helper: integrate one RK4 step for second-order ODE:
// x' = v
// v' = ( -k x - c v ) / m
function rk4Step(x: number, v: number, dt: number, m: number, k: number, c: number) {
  const f = (xx: number, vv: number) => vv;
  const g = (xx: number, vv: number) => (-k * xx - c * vv) / m;

  const k1x = f(x, v);
  const k1v = g(x, v);

  const k2x = f(x + 0.5 * dt * k1x, v + 0.5 * dt * k1v);
  const k2v = g(x + 0.5 * dt * k1x, v + 0.5 * dt * k1v);

  const k3x = f(x + 0.5 * dt * k2x, v + 0.5 * dt * k2v);
  const k3v = g(x + 0.5 * dt * k2x, v + 0.5 * dt * k2v);

  const k4x = f(x + dt * k3x, v + dt * k3v);
  const k4v = g(x + dt * k3x, v + dt * k3v);

  const xn = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
  const vn = v + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);

  return { x: xn, v: vn };
}

export default function SHMSimulator() {
  // physical params (SI)
  const [m, setM] = useState(0.5);     // kg
  const [k, setK] = useState(20);      // N/m
  const [c, setC] = useState(0.4);     // Ns/m (damping)
  const [x0, setX0] = useState(0.12);  // m (initial displacement)
  const [v0, setV0] = useState(0);     // m/s initial velocity

  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [x, setX] = useState(x0);
  const [v, setV] = useState(v0);

  const [dt, setDt] = useState(1/120); // simulation step (s)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // plotting buffer (time, displacement) - store last N points
  const bufRef = useRef<{ t: number; x: number }[]>([]);
  const startRef = useRef<number | null>(null);

  // challenge target (mm)
  const [targetMm, setTargetMm] = useState<number>(() => +(20 + Math.random() * 60).toFixed(1));
  const [message, setMessage] = useState<string | null>(null);

  // progress hook
  const { completeOnce } = useProgress("mech_shm");

  // reset to initial params
  function resetAll() {
    setRunning(false);
    setTime(0);
    setX(x0);
    setV(v0);
    bufRef.current = [{ t: 0, x: x0 }];
    startRef.current = null;
    setMessage(null);
  }

  // initialize when initial values change
  useEffect(() => {
    setX(x0);
    setV(v0);
    bufRef.current = [{ t: 0, x: x0 }];
  }, [x0, v0]);

  // simulation loop driven by requestAnimationFrame
  useEffect(() => {
    function stepSim(now: number) {
      if (!startRef.current) startRef.current = now;
      // we use a fixed physics dt (can substep)
      if (running) {
        // advance enough steps to match real elapsed time
        const last = bufRef.current.length ? bufRef.current[bufRef.current.length - 1].t : 0;
        const targetT = (now - startRef.current) / 1000; // seconds since start
        // limit to avoid huge loops
        let loops = 0;
        while (last + 1e-12 < targetT && loops < 2000) {
          // run RK4 step
          const r = rk4Step(x, v, dt, m, k, c);
          const tn = last + dt;
          // update states (we'll update outer state every X steps for performance)
          setX((prev) => r.x); // okay to call many times with same r.x
          setV((prev) => r.v);
          bufRef.current.push({ t: tn, x: r.x });
          // mutate last reference (but we read last from buffer's last element next loop)
          loops++;
          // update local copied values for next substep
          // But because we used setX/setV, and those are async, we should keep local x,v
          // To keep it simple and stable, we'll keep local closure vars by reading most recent buffer
          // Use last = tn for loop condition:
          (last as any) = tn;
        }
        setTime((last as any) + dt);
      } else {
        // not running => no physics, but still draw
      }

      // draw to canvas
      drawPlot();

      rafRef.current = requestAnimationFrame(stepSim);
    }

    rafRef.current = requestAnimationFrame(stepSim);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, dt, m, k, c]);

  // Draw function: mass-spring + displacement plot
  function drawPlot() {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = cv.width;
    const H = cv.height;
    ctx.clearRect(0, 0, W, H);

    // top area: animate spring + mass
    const topH = Math.floor(H * 0.45);
    const plotH = H - topH - 20;

    // draw background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // spring baseline
    const cx = W * 0.12;
    const rx = W * 0.7;
    const baselineY = topH / 2;

    // convert displacement x (m) -> pixels (scale)
    // choose scale so that 0.3 m maps to 120 px roughly
    const scale = 400; // px per meter (adjust for visibility)
    const px = cx + (x * scale);

    // draw fixed wall at left
    ctx.fillStyle = "#333";
    ctx.fillRect(cx - 40, baselineY - 28, 20, 56);

    // draw spring as zigzag
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const coils = 14;
    for (let i = 0; i <= coils; i++) {
      const t = i / coils;
      const sx = cx + t * (rx - 80);
      const sy = baselineY + ((i % 2 === 0) ? -12 : 12);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // draw mass block centered at px
    const massW = 80;
    const massH = 48;
    const massX = px;
    const massY = baselineY - massH / 2;
    ctx.fillStyle = "#1a73e8";
    ctx.strokeStyle = "#0d47a1";
    ctx.lineWidth = 2;
    ctx.fillRect(massX, massY, massW, massH);
    ctx.strokeRect(massX, massY, massW, massH);

    // mass label (value) inside in black (per your style)
    ctx.fillStyle = "black";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`${(x*1000).toFixed(1)} mm`, massX + massW/2 - 20, massY + massH/2 + 6);

    // draw a baseline arrow & labels (m)
    ctx.fillStyle = "#333";
    ctx.font = "12px system-ui";
    ctx.fillText("Displacement (mm)", 10, topH - 8);

    // plot area (time history)
    const plotX = 0;
    const plotY = topH + 10;
    const plotW = W;
    const plotH2 = plotH;

    // draw axes
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.strokeRect(plotX + 36, plotY, plotW - 48, plotH2 - 18);

    // get buffer
    const buf = bufRef.current.slice(-1200); // keep last N points
    if (buf.length >= 2) {
      // compute time window (last 6 seconds or larger range)
      const tmax = buf[buf.length - 1].t;
      const tmin = Math.max(0, tmax - 6);
      const tw = tmax - tmin || 1;

      // x scale: time window -> px
      const px0 = plotX + 36;
      const pxW = plotW - 48;

      // y scale: auto-fit by max abs displacement in window
      const maxAbs = Math.max(...buf.map(b => Math.abs(b.x)), 0.0001);
      const yScale = (plotH2 - 40) / (2 * Math.max(0.001, maxAbs));

      // draw zero line
      const zeroY = plotY + (plotH2 - 18) / 2;
      ctx.strokeStyle = "#bbb";
      ctx.beginPath();
      ctx.moveTo(px0, zeroY);
      ctx.lineTo(px0 + pxW, zeroY);
      ctx.stroke();

      // draw curve
      ctx.strokeStyle = "#1a73e8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < buf.length; i++) {
        const tnorm = (buf[i].t - tmin) / tw;
        const sx = px0 + tnorm * pxW;
        const sy = zeroY - buf[i].x * yScale;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // draw target amplitude line
      const targetPx = zeroY - (targetMm / 1000) * yScale;
      ctx.strokeStyle = "rgba(244, 67, 54, 0.6)";
      ctx.setLineDash([6,4]);
      ctx.beginPath();
      ctx.moveTo(px0, targetPx);
      ctx.lineTo(px0 + pxW, targetPx);
      ctx.moveTo(px0, zeroY + (targetMm / 1000) * yScale);
      ctx.lineTo(px0 + pxW, zeroY + (targetMm / 1000) * yScale);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // draw placeholder
      ctx.fillStyle = "#999";
      ctx.font = "12px system-ui";
      ctx.fillText("Run the simulation to see displacement vs time", plotX + 40, plotY + 40);
    }

    // small HUD
    ctx.fillStyle = "#000";
    ctx.font = "12px system-ui";
    ctx.fillText(`t = ${time.toFixed(2)} s`, W - 120, 18);
    // current amplitude in mm
    ctx.fillText(`x = ${(x*1000).toFixed(2)} mm`, W - 120, 34);
  }

  // Run a single physics timestep manually (used for Step)
  function stepOnce() {
    const r = rk4Step(x, v, dt, m, k, c);
    setX(r.x);
    setV(r.v);
    const nt = (bufRef.current.length ? bufRef.current[bufRef.current.length - 1].t : 0) + dt;
    bufRef.current.push({ t: nt, x: r.x });
    setTime(nt);
    drawPlot();
  }

  // check challenge: if the max absolute displacement in last 2s is <= targetMm (mm)
  function checkChallenge() {
    const now = bufRef.current.length ? bufRef.current[bufRef.current.length - 1].t : 0;
    const recent = bufRef.current.filter(b => b.t >= now - 2);
    if (recent.length === 0) {
      setMessage("Run the simulation first.");
      return;
    }
    const maxAbs = Math.max(...recent.map(r => Math.abs(r.x)));
    const maxMm = maxAbs * 1000;
    if (maxMm <= targetMm * 1.02) { // slightly forgiving
      setMessage(`✅ Success! max ${maxMm.toFixed(2)} mm ≤ target ${targetMm.toFixed(1)} mm`);
      completeOnce(3, 50);
    } else {
      setMessage(`❌ Not yet. Recent max = ${maxMm.toFixed(2)} mm; target = ${targetMm.toFixed(1)} mm. Try increasing damping or reducing initial displacement.`);
    }
  }

  // create new random challenge
  function newTarget() {
    setTargetMm(+(5 + Math.random() * 80).toFixed(1));
    setMessage(null);
  }

  // initialize buffer
  useEffect(() => {
    bufRef.current = [{ t: 0, x: x0 }];
    setX(x0);
    setV(v0);
    setTime(0);
    drawPlot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-draw when important values change
  useEffect(() => {
    drawPlot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, v, targetMm]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>Simple Harmonic Motion — Mass-Spring-Damper</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 12 }}>
        <div>
          <canvas ref={canvasRef} width={900} height={320} style={{ width: "100%", borderRadius: 10, background: "#fff" }} />

          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => { setRunning((r) => !r); if (!running) { startRef.current = performance.now(); } }} style={btnPrimary}>
              {running ? "Pause" : "Play"}
            </button>
            <button onClick={() => stepOnce()} style={btn}>Step</button>
            <button onClick={() => { resetAll(); }} style={btnWarn}>Reset</button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>Challenge target:</div>
              <div style={{ padding: "6px 10px", borderRadius: 8, background: "#f1f8ff", border: "1px solid #dceeff" }}>{targetMm.toFixed(1)} mm</div>
              <button onClick={() => checkChallenge()} style={btnPrimary}>Check</button>
              <button onClick={() => newTarget()} style={btn}>New Target</button>
            </div>
          </div>

          {message && (
            <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: message.startsWith("✅") ? "#e6f7ee" : "#fff3f3", border: message.startsWith("✅") ? "1px solid #bdeccb" : "1px solid #f3c2c2", color: "black", fontWeight: 700 }}>
              {message}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontWeight: 700 }}>Mass (m) — kg: {m.toFixed(2)}</label>
            <input type="range" min={0.05} max={5} step={0.01} value={m} onChange={(e) => setM(Number(e.target.value))} style={{ width: "100%" }} />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 700 }}>Spring constant (k) — N/m: {k.toFixed(1)}</label>
            <input type="range" min={1} max={200} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: "100%" }} />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 700 }}>Damping (c) — Ns/m: {c.toFixed(2)}</label>
            <input type="range" min={0} max={6} step={0.01} value={c} onChange={(e) => setC(Number(e.target.value))} style={{ width: "100%" }} />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 700 }}>Initial displacement x₀ (m): {x0.toFixed(3)}</label>
            <input type="range" min={-0.25} max={0.5} step={0.001} value={x0} onChange={(e) => { setX0(Number(e.target.value)); setX(Number(e.target.value)); resetAll(); }} style={{ width: "100%" }} />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 700 }}>Initial velocity v₀ (m/s): {v0.toFixed(2)}</label>
            <input type="range" min={-2} max={2} step={0.01} value={v0} onChange={(e) => { setV0(Number(e.target.value)); setV(Number(e.target.value)); resetAll(); }} style={{ width: "100%" }} />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 700 }}>Simulation step dt (s): {dt.toFixed(4)}</label>
            <input type="range" min={1/500} max={1/30} step={1/1000} value={dt} onChange={(e) => setDt(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Smaller dt = more accurate (slower)</div>
          </div>

        </div>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};
const btnPrimary: React.CSSProperties = { ...btn, background: "#1a73e8", color: "white", border: "1px solid #1a73e8" };
const btnWarn: React.CSSProperties = { ...btn, background: "#fff3e0", border: "1px solid #f0c27a" };
