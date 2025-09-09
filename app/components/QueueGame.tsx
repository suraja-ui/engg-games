// app/components/QueueGame.tsx
'use client';

import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@/app/lib/progress";

/**
 * QueueGame
 * - enqueue(value)
 * - dequeue()
 * - peek()
 * - reset()
 * - Score increments on successful enqueue/dequeue/peek actions
 * - Visual nodes are blue boxes with black numeric text
 */

export default function QueueGame() {
  const [queue, setQueue] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // progress for cse_queues
  const { progress, completeOnce } = useProgress("cse_queues");

  // tiny animation for the newest node
  useEffect(() => {
    if (!boxRef.current) return;
    boxRef.current.animate(
      [{ transform: "translateY(-8px)", opacity: 0.7 }, { transform: "translateY(0)", opacity: 1 }],
      { duration: 180, easing: "ease-out" }
    );
  }, [queue.length]);

  function enqueue() {
    const v = Number(input);
    if (input.trim() === "" || Number.isNaN(v)) {
      setMessage("Enter a numeric value to enqueue.");
      return;
    }
    setQueue((q) => [...q, v]);
    setInput("");
    setMessage(`Enqueued ${v}`);
    setScore((s) => s + 1);
  }

  function dequeue() {
    setQueue((q) => {
      if (q.length === 0) {
        setMessage("Queue is empty. Cannot dequeue.");
        return q;
      }
      const removed = q[0];
      setMessage(`Dequeued ${removed}`);
      setScore((s) => s + 1);
      return q.slice(1);
    });
  }

  function peek() {
    if (queue.length === 0) {
      setMessage("Queue is empty.");
      return;
    }
    setMessage(`Front: ${queue[0]}`);
    setScore((s) => s + 1);
  }

  function reset() {
    setQueue([]);
    setMessage("Queue cleared.");
    setScore(0);
  }

  // mark complete when score >= 5 (only once)
  useEffect(() => {
    if (score >= 5) {
      completeOnce(3, 50); // 3 stars, 50 XP
    }
  }, [score, completeOnce]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter value"
          style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button onClick={enqueue} style={btn}>Enqueue</button>
        <button onClick={dequeue} style={btn}>Dequeue</button>
        <button onClick={peek} style={btn}>Peek</button>
        <button onClick={reset} style={{ ...btn, background: "#eee", color: "#333" }}>Reset</button>
        <div style={{ marginLeft: "auto", fontWeight: 700 }}>Score: {score}</div>
      </div>

      {/* Message */}
      <div style={{ minHeight: 22, color: "#333" }}>{message}</div>

      {/* Queue visual */}
      <div style={{
        minHeight: 140,
        border: "2px dashed #bbb",
        borderRadius: 12,
        background: "#f7fbff",
        padding: 12,
        display: "flex",
        alignItems: "center",
        overflowX: "auto"
      }}>
        <div style={{ display: "flex", gap: 10, padding: "6px 8px", alignItems: "center" }}>
          {/* label for front */}
          <div style={{ color: "#666", fontSize: 12, whiteSpace: "nowrap" }}>Front</div>

          {/* nodes */}
          {queue.length === 0 ? (
            <div style={{ color: "#666", fontStyle: "italic", marginLeft: 8 }}>Queue is empty</div>
          ) : (
            queue.map((val, idx) => {
              const isLast = idx === queue.length - 1;
              return (
                <div
                  key={idx}
                  ref={isLast ? boxRef : null}
                  style={{
                    minWidth: 56,
                    height: 48,
                    borderRadius: 10,
                    background: "#1a73e8",   // blue node
                    color: "black",          // value in black
                    border: "2px solid #0d47a1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {val}
                </div>
              );
            })
          )}

          {/* label for rear */}
          <div style={{ color: "#666", fontSize: 12, whiteSpace: "nowrap" }}>Rear</div>
        </div>
      </div>

      {/* small tip */}
      <div style={{ color: "#666" }}>
        Tip: Enqueue adds to the rear. Dequeue removes from the front. Try enqueueing 5 values, then dequeue a few.
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
