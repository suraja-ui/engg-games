import LevelItem from "@/app/components/LevelItem";

type Level = { id: string; title: string };
const LEVELS: Record<string, Level[]> = {
  cse: [
    { id: "stacks",  title: "Stacks (Push/Pop)" },
    { id: "queues",  title: "Queues (Enqueue/Dequeue)" },
    { id: "sorting", title: "Sorting Basics" },
    { id: "graphs",  title: "Graph Basics" },
  ],
  ece: [
    { id: "dc",       title: "DC Circuits" },
    { id: "rlc",      title: "RLC Response" },
    { id: "diodes",   title: "Diodes & Rectifiers" },
  ],
  mech: [
    { id: "torque",   title: "Torque & Balance" },
    { id: "beams",    title: "Beams & Bending" },
    { id: "shm",      title: "Simple Harmonic Motion" },
  ],
};

const SUBJECT_TITLES: Record<string, string> = {
  cse: "Computer Science (CSE)",
  ece: "Electronics & Communication (ECE)",
  mech: "Mechanical (ME)"
};

export async function generateStaticParams() {
  return Object.keys(LEVELS).map((subject) => ({
    subject,
  }));
}

export default function SubjectLevelsPage({
  params,
}: { params: { subject: string } }) {
  const { subject } = params;
  const title = SUBJECT_TITLES[subject] ?? "Unknown Subject";
  const levels = LEVELS[subject] ?? [];

  if (!LEVELS[subject]) {
    return (
      <main style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
        <h1>Subject not found</h1>
        <a href="/subjects">← Back to Subjects</a>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <h1>{title}</h1>
      <p>Pick a level:</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {levels.map((l) => (
          <li key={l.id}>
            <LevelItem subject={subject} level={l} />
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 20 }}>
        <a href="/subjects">← Back to Subjects</a>
      </div>
    </main>
  );
}
