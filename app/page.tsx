export default function Home() {
  return (
    <main style={{ textAlign: "center", marginTop: 60 }}>
      <h1>Engineering Games 🚀</h1>
      <p>Learn engineering with fun, tiny games.</p>
      <a
        href="/subjects"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "12px 20px",
          background: "royalblue",
          color: "white",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Start Learning
      </a>
    </main>
  );
}
