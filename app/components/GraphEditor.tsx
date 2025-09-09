// app/components/GraphEditor.tsx
'use client';

import React, { useEffect, useRef, useState } from "react";

/**
 * GraphEditor
 * - click empty space -> add node
 * - click node -> select source; click another node -> create/remove edge
 * - drag nodes
 * - toggle directed / weighted
 * - edit weight via small prompt / inline
 * - shows adjacency list and adjacency matrix live
 * - export / import JSON
 */

type NodeData = {
  id: string;
  x: number;
  y: number;
  label?: string;
};

type EdgeData = {
  id: string;
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
};

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function GraphEditor({
  initialNodes = 8,
}: { initialNodes?: number }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [directed, setDirected] = useState(false);
  const [weighted, setWeighted] = useState(false);

  // interaction state
  const [selected, setSelected] = useState<string | null>(null); // node id selected for edge creation
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);

  // UI helpers
  useEffect(() => {
    // seed random nodes if empty
    if (nodes.length === 0) {
      const w = 780, h = 300;
      const arr: NodeData[] = [];
      for (let i = 0; i < Math.max(0, initialNodes); i++) {
        arr.push({
          id: uid("n"),
          x: 60 + (i % 8) * 90,
          y: 40 + Math.floor(i / 8) * 80,
          label: String(i + 1),
        });
      }
      setNodes(arr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist positions to localStorage (optional)
  useEffect(() => {
    const key = "graph_editor_snapshot_v1";
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const key = "graph_editor_snapshot_v1";
    const snapshot = { nodes, edges };
    localStorage.setItem(key, JSON.stringify(snapshot));
  }, [nodes, edges]);

  // helpers
  function findNodeAtPoint(cx: number, cy: number) {
    // radius 18
    return nodes.find((n) => {
      return (cx - n.x) ** 2 + (cy - n.y) ** 2 <= 22 * 22;
    });
  }

  function onSvgClick(e: React.MouseEvent) {
    if (!svgRef.current) return;
    // compute SVG coords
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hit = findNodeAtPoint(x, y);
    if (!hit) {
      // add a new node
      const newNode: NodeData = { id: uid("n"), x, y, label: String(nodes.length + 1) };
      setNodes((s) => [...s, newNode]);
      setSelected(null);
      return;
    }

    // clicked a node
    if (!selected) {
      setSelected(hit.id);
      return;
    } else {
      // if same node clicked => toggle selection off
      if (selected === hit.id) {
        setSelected(null);
        return;
      }

      // create or toggle edge between selected -> hit
      const from = selected;
      const to = hit.id;
      // if undirected and order irrelevant, normalize ids for check
      const existing = edges.find((ed) =>
        ed.from === from && ed.to === to && ed.directed === directed ||
        (!directed && ((ed.from === from && ed.to === to) || (ed.from === to && ed.to === from)))
      );

      if (existing) {
        // remove existing edge
        setEdges((e) => e.filter((ee) => ee.id !== existing.id));
      } else {
        const newEdge: EdgeData = {
          id: uid("e"),
          from,
          to,
          directed,
          weight: weighted ? 1 : undefined,
        };
        setEdges((s) => [...s, newEdge]);
      }
      setSelected(null);
    }
  }

  // dragging
  function onNodePointerDown(e: React.PointerEvent, node: NodeData) {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging({ id: node.id, ox: e.clientX, oy: e.clientY });
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = e.clientX - dragging.ox;
    const dy = e.clientY - dragging.oy;
    setNodes((prev) => prev.map((n) => (n.id === dragging.id ? { ...n, x: n.x + dx, y: n.y + dy } : n)));
    setDragging({ id: dragging.id, ox: e.clientX, oy: e.clientY });
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragging) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {}
    }
    setDragging(null);
  }

  // UI controls
  function clearAll() {
    if (!confirm("Clear all nodes & edges?")) return;
    setNodes([]);
    setEdges([]);
    setSelected(null);
  }

  function exportJson() {
    const data = { nodes, edges, directed, weighted };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJsonFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          setDirected(Boolean(parsed.directed));
          setWeighted(Boolean(parsed.weighted));
        } else {
          alert("Invalid graph JSON.");
        }
      } catch (err) {
        alert("Failed to parse JSON.");
      }
    };
    reader.readAsText(file);
  }

  function randomGraph(n = 8, p = 0.18) {
    const W = 780, H = 300;
    const arr: NodeData[] = [];
    for (let i = 0; i < n; i++) {
      arr.push({ id: uid("n"), x: 40 + Math.random() * (W - 80), y: 30 + Math.random() * (H - 60), label: String(i + 1) });
    }
    const eds: EdgeData[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = (directed ? 0 : i + 1); j < n; j++) {
        if (i === j) continue;
        if (Math.random() < p) {
          eds.push({ id: uid("e"), from: arr[i].id, to: arr[j].id, directed, weight: weighted ? Math.ceil(Math.random() * 10) : undefined });
        }
      }
    }
    setNodes(arr);
    setEdges(eds);
  }

  // adjacency list / matrix
  function adjacencyList() {
    const map: Record<string, { to: string; weight?: number }[]> = {};
    nodes.forEach((n) => (map[n.id] = []));
    edges.forEach((ed) => {
      map[ed.from].push({ to: ed.to, weight: ed.weight });
      if (!ed.directed) {
        map[ed.to].push({ to: ed.from, weight: ed.weight });
      }
    });
    return map;
  }

  function adjacencyMatrix() {
    const ids = nodes.map((n) => n.id);
    const idx = Object.fromEntries(ids.map((id, i) => [id, i]));
    const N = nodes.length;
    const mat: (number | null)[][] = Array.from({ length: N }, () => Array.from({ length: N }, () => null));
    edges.forEach((ed) => {
      mat[idx[ed.from]][idx[ed.to]] = ed.weight ?? 1;
      if (!ed.directed) mat[idx[ed.to]][idx[ed.from]] = ed.weight ?? 1;
    });
    return { mat, ids };
  }

  // edit weight
  function editEdgeWeight(ed: EdgeData) {
    if (!weighted) return;
    const val = prompt("Enter weight (number):", String(ed.weight ?? 1));
    if (val === null) return;
    const num = Number(val);
    if (Number.isNaN(num)) {
      alert("Invalid number");
      return;
    }
    setEdges((prev) => prev.map((e) => (e.id === ed.id ? { ...e, weight: num } : e)));
  }

  function removeNode(nodeId: string) {
    setNodes((s) => s.filter((n) => n.id !== nodeId));
    setEdges((s) => s.filter((e) => e.from !== nodeId && e.to !== nodeId));
    if (selected === nodeId) setSelected(null);
  }

  function removeEdge(edgeId: string) {
    setEdges((s) => s.filter((e) => e.id !== edgeId));
  }

  // small helpers to get node by id
  const getNode = (id: string) => nodes.find((n) => n.id === id);

  // render helpers
  const { mat, ids } = adjacencyMatrix();
  const adj = adjacencyList();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Graph Editor</h3>
        <label style={{ marginLeft: 12 }}>
          <input type="checkbox" checked={directed} onChange={(e) => setDirected(e.target.checked)} /> Directed
        </label>
        <label>
          <input type="checkbox" checked={weighted} onChange={(e) => setWeighted(e.target.checked)} /> Weighted
        </label>

        <button onClick={() => randomGraph(6, 0.25)} style={{ marginLeft: 12 }}>Random Graph</button>
        <button onClick={() => { setNodes([]); setEdges([]); }}>New Blank</button>
        <button onClick={() => exportJson()}>Export JSON</button>
        <label style={{ display: "inline-block" }}>
          <input type="file" accept="application/json" style={{ display: "none" }} onChange={(ev) => importJsonFile(ev.target.files?.[0] ?? null)} />
          <span style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}>Import JSON</span>
        </label>
        <button onClick={() => clearAll()} style={{ marginLeft: "auto", background: "#fff5f5" }}>Clear All</button>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <svg
          ref={svgRef}
          width={900}
          height={320}
          style={{ border: "2px dashed #bbb", borderRadius: 8, background: "#fff" }}
          onClick={onSvgClick}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* edges */}
          {edges.map((ed) => {
            const a = getNode(ed.from);
            const b = getNode(ed.to);
            if (!a || !b) return null;
            // compute arrow head if directed
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const ux = dx / len;
            const uy = dy / len;
            const pad = 22;
            const sx = a.x + ux * pad;
            const sy = a.y + uy * pad;
            const tx = b.x - ux * pad;
            const ty = b.y - uy * pad;
            // for undirected, draw a single line; for double edges avoid overlap (basic)
            return (
              <g key={ed.id}>
                <line x1={sx} y1={sy} x2={tx} y2={ty} stroke="#333" strokeWidth={2} />
                {ed.directed && (
                  <polygon
                    points={`${tx},${ty} ${tx - uy * 8},${ty + ux * 8} ${tx + uy * 8},${ty - ux * 8}`}
                    fill="#333"
                    stroke="none"
                  />
                )}
                {/* clickable weight label */}
                {weighted && (
                  <g onClick={() => editEdgeWeight(ed)} style={{ cursor: "pointer" }}>
                    <rect x={(sx + tx) / 2 - 16} y={(sy + ty) / 2 - 12} width={32} height={20} rx={4} fill="#fff" stroke="#ddd" />
                    <text x={(sx + tx) / 2} y={(sy + ty) / 2 + 3} fontSize={12} fill="#000" textAnchor="middle">
                      {ed.weight ?? 1}
                    </text>
                  </g>
                )}
                {/* small remove icon */}
                <g onClick={() => removeEdge(ed.id)} style={{ cursor: "pointer" }}>
                  <rect x={tx - 8} y={ty - 8} width={16} height={16} fill="transparent" />
                </g>
              </g>
            );
          })}

          {/* nodes */}
          {nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              <circle
                r={20}
                cx={0}
                cy={0}
                fill={selected === n.id ? "#ffe082" : "#e3f2fd"}
                stroke="#2196f3"
                strokeWidth={2}
                onPointerDown={(e) => onNodePointerDown(e, n)}
                onPointerUp={() => { /* noop */ }}
                onClick={(ev) => { ev.stopPropagation(); /* click handled at svg level */ }}
                style={{ cursor: "grab" }}
              />
              <text x={0} y={6} fontSize={14} fontWeight={700} textAnchor="middle" fill="#000">{n.label ?? n.id.slice(0,3)}</text>
              {/* small remove button */}
              <rect x={14} y={-26} width={12} height={12} fill="#fff" stroke="#ccc" onClick={() => removeNode(n.id)} style={{ cursor: "pointer" }} />
              <text x={20} y={-16} fontSize={10} textAnchor="middle" fill="#333" style={{ pointerEvents: "none" }}>×</text>
            </g>
          ))}

          {/* optional overlay when dragging to show line */}
          {selected && (() => {
            const a = getNode(selected);
            if (!a) return null;
            return <circle cx={a.x} cy={a.y} r={26} fill="rgba(255,230,128,0.12)" stroke="none" />;
          })()}
        </svg>

        <div style={{ width: 360 }}>
          <div style={{ marginBottom: 8 }}>
            <b>Adjacency List</b>
            <div style={{ maxHeight: 180, overflow: "auto", marginTop: 6, padding: 8, border: "1px solid #eee", borderRadius: 6, background: "#fafafa" }}>
              {nodes.length === 0 ? <div style={{ color: "#666" }}>No nodes</div> :
                nodes.map((n) => (
                  <div key={n.id} style={{ marginBottom: 6 }}>
                    <b>{n.label}</b>:
                    {(adj[n.id] ?? []).length === 0 ? <span style={{ color: "#666", marginLeft: 6 }}> (no neighbors)</span> :
                      (adj[n.id] || []).map((p, i) => (
                        <span key={i} style={{ display: "inline-block", marginLeft: 8, padding: "2px 6px", borderRadius: 6, background: "#fff", border: "1px solid #eee" }}>
                          {getNode(p.to)?.label ?? p.to}{p.weight ? ` (${p.weight})` : ""}
                        </span>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <b>Adjacency Matrix</b>
            <div style={{ overflowX: "auto", marginTop: 6, border: "1px solid #eee", borderRadius: 6, padding: 8, background: "#fff" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "1px solid #eee", padding: 6 }}></th>
                    {nodes.map((n) => <th key={n.id} style={{ borderBottom: "1px solid #eee", padding: 6 }}>{n.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ids.map((rid, i) => (
                    <tr key={rid}>
                      <td style={{ padding: 6, borderBottom: "1px solid #f5f5f5" }}><b>{getNode(rid)?.label}</b></td>
                      {ids.map((cid, j) => (
                        <td key={cid} style={{ textAlign: "center", padding: 6, borderBottom: "1px solid #f5f5f5" }}>{mat[i][j] ?? 0}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <b>Quick Tips</b>
            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
              <li>Click empty space to add node.</li>
              <li>Click a node to select it, then click another to add/remove an edge.</li>
              <li>Drag a node to reposition.</li>
              <li>Toggle Directed or Weighted to change edge behavior.</li>
              <li>Click the small × above node to remove node (and its edges).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
