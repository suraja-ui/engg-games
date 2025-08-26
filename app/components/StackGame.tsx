
'use client';

import { useProgress } from "@/app/lib/progress";
import { useEffect, useRef, useState } from "react";

/**
 * Simple Stack game:
 * - Type a value, click Push to add to top.
 * - Click Pop to remove top.
 * - Peek shows the top.
 * - Score = number of correct operations done.
 */


export default function StackGame() {
  const { progress, completeOnce } = useProgress("cse_stacks");
  const [stack, setStack] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string>("");
  const [score, setScore] = useState(0);

  // for a tiny “drop in” animation
  const boxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!boxRef.current) return;
    boxRef.current.animate(
      [{ transform: "translateY(-10px)", opacity: 0.6 }, { transform: "translateY(0)", opacity: 1 }],
      { duration: 160, easing: "ease-out" }
    );
  }, [stack.length]);

  function push() {
    if (!input.trim()) {
      setMessage("Enter a value to push.");
      return;
    }
    setStack((prev) => [ ...prev, input.trim() ]);
    setInput("");
    setMessage(`Pushed!`);
    setScore((s) => s + 1);
  }

  function pop() {
    setStack((prev) => {
      if (prev.length === 0) {
        setMessage("Stack is empty. Cannot pop.");
        return prev;
      }
      const top = prev[prev.length - 1];
      setMessage(`Popped: ${top}`);
      setScore((s) => s + 1);
      return prev.slice(0, -1);
    });
  }

  function peek() {
    if (stack.length === 0) {
      setMessage("Stack is empty.");
    } else {
      setMessage(`Top: ${stack[stack.length - 1]}`);
      setScore((s) => s + 1);
    }
  }

  function reset() {
    setStack([]);
    setMessage("Reset the stack.");
    setScore(0);
  }

  useEffect(() => {
    if (score >= 5) {
      completeOnce(3, 50); // 3 stars, 50 XP
    } else if (score >= 3 && progress.stars < 2) {
      // optional mid-reward
      // complete(2, 30)
    }
  }, [score, progress.stars, completeOnce]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter value"
          style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button onClick={push} style={btn}>Push</button>
        <button onClick={pop} style={btn}>Pop</button>
        <button onClick={peek} style={btn}>Peek</button>
        <button onClick={reset} style={{ ...btn, background: "#eee", color: "#333" }}>Reset</button>
      </div>

      {/* Message & score */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ minHeight: 22, color: "#333" }}>{message}</div>
        <div style={{ marginLeft: "auto", fontWeight: 700 }}>Score: {score}</div>
      </div>

      {/* Stack visuals */}
      <div
        style={{
          height: 320,
          border: "2px dashed #bbb",
          borderRadius: 12,
          background: "#fafafa",
          padding: 12,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 240,
            borderLeft: "4px solid #999",
            borderRight: "4px solid #999",
            padding: 8,
            display: "flex",
            flexDirection: "column-reverse",
            gap: 8,
            alignItems: "stretch",
          }}
        >
          {stack.map((val, i) => (
            <div
              key={i}
              ref={i === stack.length - 1 ? boxRef : null}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "white",
                textAlign: "center",
                fontWeight: 700,
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              {val}
            </div>
          ))}
          {/* base label */}
          <div style={{ textAlign: "center", color: "#777", fontSize: 12, marginTop: 6 }}>
            Bottom
          </div>
        </div>
      </div>

      {/* mini instructions */}
      <div style={{ color: "#666", fontSize: 14 }}>
        Tip: Try pushing 3 values, then pop twice, then peek.  
        This mirrors real stack operations used in function calls, DFS, and undo history.
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
