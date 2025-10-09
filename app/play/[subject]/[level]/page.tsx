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

// Static params for all valid subject/level combinations
const LEVEL_ROUTES = [
  // CSE levels
  { subject: "cse", level: "stacks" },
  { subject: "cse", level: "queues" },
  { subject: "cse", level: "sorting" },
  { subject: "cse", level: "graphs" },
  // ECE levels
  { subject: "ece", level: "dc" },
  { subject: "ece", level: "rlc" },
  { subject: "ece", level: "diodes" },
  // MECH levels
  { subject: "mech", level: "torque" },
  { subject: "mech", level: "beams" },
  { subject: "mech", level: "shm" },
];

export async function generateStaticParams() {
  return LEVEL_ROUTES;
}

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

      <div style={{ marginTop: 20 }}>
        <Link href={`/subjects/${subj}`}>← Back to Levels</Link>
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
      <p><em>{level} game coming soon.</em></p>
      <p>Meanwhile, explore other levels in {subject.toUpperCase()}.</p>
    </div>
  );
}
