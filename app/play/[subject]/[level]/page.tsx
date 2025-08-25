import Link from "next/link";

export default function PlayLevelPage({
  params,
}: { params: { subject: string; level: string } }) {
  const { subject, level } = params;

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <h1>Play: {level.replace(/-/g, " ")}</h1>
      <p>
        Subject: <strong>{subject.toUpperCase()}</strong>
      </p>

      <div style={{
        padding: 20,
        marginTop: 16,
        border: "2px dashed #bbb",
        borderRadius: 12,
        background: "#fafafa"
      }}>
        <p><em>Game area placeholder.</em></p>
        <p>In Week 3–5 we’ll put the real interactive game here.</p>
        <button
          onClick={() => alert("Imagine the level completed!")}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Complete Level
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href={`/subjects/${subject}`}>← Back to Levels</Link>
      </div>
    </main>
  );
}
