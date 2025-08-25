'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import StackGame from "@/app/components/StackGame";

export default function PlayLevelPage() {
  const { subject, level } = useParams<{ subject: string; level: string }>();
  const subj = String(subject);
  const lvl = String(level);

  const title = lvl.replace(/-/g, " ");

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ textTransform: "capitalize" }}>Play: {title}</h1>
      <p style={{ marginBottom: 10 }}>
        Subject: <strong>{subj.toUpperCase()}</strong>
      </p>

      {/* Switch which game to show based on level */}
      {subj === "cse" && lvl === "stacks" ? (
        <StackGame />
      ) : (
        <Placeholder />
      )}

      <div style={{ marginTop: 20 }}>
        <Link href={`/subjects/${subj}`}>← Back to Levels</Link>
      </div>
    </main>
  );
}

function Placeholder() {
  return (
    <div
      style={{
        padding: 20,
        marginTop: 16,
        border: "2px dashed #bbb",
        borderRadius: 12,
        background: "#fafafa",
      }}
    >
      <p><em>Game coming soon.</em></p>
      <p>In later weeks we’ll add an interactive game for this level.</p>
    </div>
  );
}
