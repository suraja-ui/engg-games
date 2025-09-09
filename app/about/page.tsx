import Image from "next/image";
import React from "react";

export default function AboutPage() {
  return (
    <main style={page}>
      <section style={card}>
        <div style={left}>
          {/* profile photo */}
          <Image
            src="/profile.jpg" // place your uploaded image in /public/profile.jpg
            alt="Suraja Goudar"
            width={220}
            height={220}
            style={{ borderRadius: "50%", objectFit: "cover", border: "4px solid #1a73e8" }}
          />
        </div>

        <div style={right}>
          <h1 style={title}>Developed by <span style={{ color: "#1a73e8" }}>Suraja Goudar</span></h1>
          <p style={tagline}>
            A <strong>Polymath</strong>, <strong>Writer</strong>, <strong>Content Creator</strong>, and <strong>Entrepreneur</strong> — passionate about
            building ideas that simplify learning and inspire curiosity.
          </p>
          <p style={bio}>
            I created <em>Engineering Games</em> to make education engaging, playful, and
            deeply interactive. Instead of reading static definitions, students can
            now explore concepts through live simulations and challenges.  
          </p>
          <p style={bio}>
            Beyond engineering education, I explore multiple domains, write
            about ideas, create content for the next generation of learners, and
            constantly experiment with entrepreneurship.  
          </p>
          <div style={socials}>
            <a href="mailto:suraja@example.com" style={btn}>📧 Contact Me</a>
            <a href="/" style={btn}>🏠 Back to Home</a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- styles ---------- */
const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #071028, #0b1220)",
  color: "#f8fafc",
  fontFamily: "Inter, system-ui, sans-serif",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 40,
};

const card: React.CSSProperties = {
  display: "flex",
  gap: 32,
  maxWidth: 900,
  background: "rgba(255,255,255,0.05)",
  padding: 32,
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
  alignItems: "center",
};

const left: React.CSSProperties = { flexShrink: 0 };
const right: React.CSSProperties = { flex: 1 };

const title: React.CSSProperties = { fontSize: 28, fontWeight: 800, marginBottom: 12 };
const tagline: React.CSSProperties = { fontSize: 18, marginBottom: 18, color: "#cfe0ff" };
const bio: React.CSSProperties = { fontSize: 15, marginBottom: 12, lineHeight: 1.6, color: "#dbeafe" };

const socials: React.CSSProperties = { marginTop: 20, display: "flex", gap: 12 };
const btn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  background: "#1a73e8",
  color: "white",
  fontWeight: 700,
  textDecoration: "none",
};