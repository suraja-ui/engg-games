'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import StackGame from "@/app/components/StackGame";
import RlcSandbox from "@/app/components/RlcSandbox";
import BeamBalanceGame from "@/app/components/BeamBalanceGame";
import QueueGame from "@/app/components/QueueGame";
import DcCircuit from "@/app/components/DcCircuit";
import BeamBendingSandbox from "@/app/components/BeamBendingSandbox";
import SortingBasics from "@/app/components/SortingBasics";
import GraphEditor from "@/app/components/GraphEditor";
import SHMSimulator from "@/app/components/SHMSimulator";

export default function PlayLevelPage() {
  const { subject, level } = useParams<{ subject: string; level: string }>();
  const subj = String(subject);
  const lvl = String(level);

  const title = lvl.replace(/-/g, " ");

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 16px",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0f2027 0%, #2c5364 100%)",
        borderRadius: 18,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: 16,
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
          padding: "32px 28px 24px 28px",
          marginTop: 36,
          width: "100%",
          maxWidth: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            textTransform: "capitalize",
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: 1,
            color: "#1a237e",
            marginBottom: 8,
          }}
        >
          Play: {title}
        </h1>
        <p style={{ marginBottom: 18, color: "#374151", fontSize: 18 }}>
          Subject:{" "}
          <strong style={{ color: "#0d47a1" }}>{subj.toUpperCase()}</strong>
        </p>

        <div style={{ width: "100%" }}>
          {subj === "mech" && lvl === "beams" ? (
            <BeamBendingSandbox />
          ) : subj === "mech" && lvl === "torque" ? (
            <BeamBalanceGame />
          ) : subj === "mech" && lvl === "shm" ? (
            <SHMSimulator />
          ) : subj === "ece" && lvl === "dc" ? (
            <DcCircuit />
          ) : subj === "ece" && lvl === "rlc" ? (
            <RlcSandbox />
          ) : subj === "cse" && lvl === "queues" ? (
            <QueueGame />
          ) : subj === "cse" && lvl === "stacks" ? (
            <StackGame />
          ) : subj === "cse" && lvl === "sorting" ? (
            <SortingBasics />
          ) : subj === "cse" && lvl === "graphs" ? (
            <GraphEditor />
          ) : (
            <Placeholder subject={subj} level={lvl} />
          )}
        </div>

        <div style={{ marginTop: 28, width: "100%", textAlign: "center" }}>
          <Link
            href={`/subjects/${subj}`}
            style={{
              color: "#1a73e8",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              borderRadius: 8,
              padding: "8px 16px",
              background: "#e3f2fd",
              transition: "background 0.2s",
            }}
          >
            ← Back to Levels
          </Link>
        </div>
      </div>
    </main>
  );
}

function Placeholder({ subject, level }: { subject: string; level: string }) {
  return (
    <div
      style={{
        padding: 20,
        marginTop: 16,
        border: "2px dashed #bbb",
        borderRadius: 12,
        background: "#fafafa",
        textAlign: "center",
      }}
    >
      <p>
        <em>{level} game coming soon.</em>
      </p>
      <p>Meanwhile, explore other levels in {subject.toUpperCase()}.</p>
    </div>
  );
}
