type Subject = { id: string; name: string; emoji: string };

const SUBJECTS: Subject[] = [
  { id: "cse", name: "Computer Science", emoji: "💻" },
  { id: "ece", name: "Electronics", emoji: "🔌" },
  { id: "mech", name: "Mechanical", emoji: "⚙️" },
];

const LEVELS: Record<string, { id: string; title: string }[]> = {
  cse: [
    { id: "stacks", title: "Stacks (Push/Pop)" },
    { id: "queues", title: "Queues (Enqueue/Dequeue)" },
    { id: "sorting", title: "Sorting Basics" },
    { id: "graphs", title: "Graphs Basics" },
  ],
  ece: [
    { id: "dc", title: "DC Circuits" },
    { id: "rlc", title: "RLC Response" },
    { id: "diodes", title: "Diodes & Rectifiers" },
  ],
  mech: [
    { id: "torque", title: "Torque & Balance" },
    { id: "beams", title: "Beams & Bending" },
    { id: "shm", title: "Simple Harmonic Motion" },
  ],
};


export default function SubjectsPage() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1>Choose a Subject</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginTop: 20
      }}>
        {SUBJECTS.map(s => (
          <a key={s.id}
             href={`/subjects/${s.id}`}
             style={{
               display: "block",
               border: "1px solid #ddd",
               borderRadius: 14,
               padding: 18,
               textDecoration: "none",
               color: "inherit",
             }}>
            <div style={{ fontSize: 32 }}>{s.emoji}</div>
            <div style={{ fontWeight: 700, marginTop: 8 }}>{s.name}</div>
            <div style={{ color: "#666", marginTop: 4 }}>Tap to see levels →</div>
          </a>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <a href="/" style={{ textDecoration: "none" }}>← Back to Home</a>
      </div>
    </main>
  );
}
