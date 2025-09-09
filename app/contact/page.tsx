// app/contact/page.tsx
import React from "react";
import Link from "next/link";
import ContactForm from "@/app/components/ContactForm";

export default function ContactPage() {
  return (
    <main style={page}>
      <header style={header}>
        <div style={brandWrap}>
          <div style={brandLogo}>🚀</div>
          <div>
            <div style={brandTitle}>Engineering Games</div>
            <div style={brandSub}>Reach out — I’d love to connect</div>
          </div>
        </div>
        <nav style={nav}>
          <Link href="/" style={navLink}>Home</Link>
          <Link href="/subjects" style={navLink}>Subjects</Link>
          <Link href="/about" style={navLink}>About</Link>
        </nav>
      </header>

      <section style={hero}>
        <div style={heroLeft}>
          <h1 style={title}>Let’s build, learn & collaborate.</h1>
          <p style={subtitle}>
            Whether you have feedback, collaboration ideas, or want to try a demo in class —
            drop a message. I reply to all thoughtful notes.
          </p>

          <div style={cardsRow}>
            <div style={infoCard}>
              <div style={infoHead}>
                <div style={infoIcon}>📧</div>
                <div>
                  <div style={infoTitle}>Email</div>
                  <div style={infoSub}>Fastest way to reach me</div>
                </div>
              </div>
              <a href="mailto:surajearlybird@gmail.com" style={infoLink}>surajearlybird@gmail.com</a>
              <div style={cardCTArow}>
                <a href="mailto:surajearlybird@gmail.com" style={openBtn}>Email now</a>
                <button onClick={() => navigator.clipboard?.writeText("surajearlybird@gmail.com")} style={ghostBtn}>Copy</button>
              </div>
            </div>

            <div style={{ ...infoCard, background: "linear-gradient(180deg,#fff7f0,#fff2e6)", color: "#071127" }}>
              <div style={infoHead}>
                <div style={{...infoIcon, background:"#ffd89b"}}>🔗</div>
                <div>
                  <div style={{ fontWeight: 800 }}>LinkedIn</div>
                  <div style={{ color: "#334155" }}>Connect professionally</div>
                </div>
              </div>
              <a href="https://www.linkedin.com/in/suraja-goudar-0a833b316" target="_blank" rel="noreferrer" style={{ ...infoLink, color: "#0b5ed7" }}>
                linkedin.com/in/suraja-goudar-0a833b316
              </a>
              <div style={cardCTArow}>
                <a href="https://www.linkedin.com/in/suraja-goudar-0a833b316" target="_blank" rel="noreferrer" style={openBtnAlt}>Open LinkedIn</a>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Short bio</div>
            <div style={{ color: "#dbeafe", lineHeight: 1.6 }}>
              Suraja Goudar — a <strong>polymath</strong>, <strong>writer</strong>, <strong>content creator</strong>, and <strong>entrepreneur</strong>.
              I build interactive learning tools that make engineering concepts clear and fun.
            </div>
          </div>
        </div>

        <div style={heroRight}>
          <div style={formWrap}>
            <div style={formHeader}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Send a quick message</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>This opens your default mail client (mailto:)</div>
            </div>

            {/* ContactForm is client component you already have */}
            <ContactForm emailTo="surajearlybird@gmail.com" />

            <div style={{ marginTop: 14, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
              Or reach me directly: <a href="mailto:surajearlybird@gmail.com" style={{ color: "#dbeafe", textDecoration: "underline" }}>surajearlybird@gmail.com</a>
            </div>
          </div>

          <div style={quickStats}>
            <div style={statItem}>
              <div style={statBig}>Polymath</div>
              <div style={statSmall}>Wide-range problem solving</div>
            </div>
            <div style={statItem}>
              <div style={statBig}>Writer</div>
              <div style={statSmall}>Clear, concise explanations</div>
            </div>
            <div style={statItem}>
              <div style={statBig}>Creator</div>
              <div style={statSmall}>Content & product building</div>
            </div>
          </div>
        </div>
      </section>

      <footer style={footer}>
        <div style={{ fontWeight: 700 }}>Developed by SURAJA GOUDAR</div>
      </footer>
    </main>
  );
}

/* --------------- styles --------------- */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#071028 0%, #0b1220 100%)",
  color: "#f8fafc",
  fontFamily: "Inter, system-ui, sans-serif",
  padding: 28,
  boxSizing: "border-box",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: 1100,
  margin: "0 auto 18px",
};

const brandWrap: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };
const brandLogo: React.CSSProperties = { fontSize: 28 };
const brandTitle: React.CSSProperties = { fontWeight: 800, fontSize: 16 };
const brandSub: React.CSSProperties = { fontSize: 12, color: "#cfe0ff" };

const nav: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };
const navLink: React.CSSProperties = { color: "#cfe0ff", textDecoration: "none", padding: "6px 8px" };

const hero: React.CSSProperties = {
  maxWidth: 1100,
  margin: "12px auto",
  display: "flex",
  gap: 28,
  alignItems: "flex-start",
};
const heroLeft: React.CSSProperties = { flex: 1, minWidth: 320 };
const heroRight: React.CSSProperties = { width: 420, minWidth: 320 };

const title: React.CSSProperties = { fontSize: 32, margin: "6px 0 8px", color: "#fff" };
const subtitle: React.CSSProperties = { color: "#cfe0ff", marginBottom: 14, fontSize: 15 };

const cardsRow: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
const infoCard: React.CSSProperties = {
  background: "linear-gradient(180deg,#07183a,#0b2130)",
  color: "#dbeafe",
  padding: 14,
  borderRadius: 12,
  minWidth: 260,
  border: "1px solid rgba(255,255,255,0.03)",
  boxShadow: "0 10px 30px rgba(2,6,23,0.5)"
};

const infoHead: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center", marginBottom: 8 };
const infoIcon: React.CSSProperties = { fontSize: 22, width: 44, height: 44, display: "grid", placeItems: "center", background: "#10233a", borderRadius: 10 };
const infoTitle: React.CSSProperties = { fontWeight: 800 };
const infoSub: React.CSSProperties = { color: "#94a3b8", fontSize: 13 };
const infoLink: React.CSSProperties = { display: "block", marginTop: 8, color: "#cfe0ff", fontWeight: 700, textDecoration: "none" };

const cardCTArow: React.CSSProperties = { display: "flex", gap: 8, marginTop: 12 };
const openBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, background: "#1a73e8", color: "white", fontWeight: 800, textDecoration: "none", border: "none", cursor: "pointer" };
const openBtnAlt: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, background: "#f3f4f6", color: "#071127", fontWeight: 700, textDecoration: "none", border: "none" };
const ghostBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, background: "transparent", color: "#cfe0ff", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" };

const formWrap: React.CSSProperties = { background: "linear-gradient(180deg,#0b1624,#071224)", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.03)" };
const formHeader: React.CSSProperties = { marginBottom: 10, color: "#e6eef8" };

const quickStats: React.CSSProperties = { display: "flex", gap: 10, marginTop: 18, flexDirection: "column" };
const statItem: React.CSSProperties = { background: "linear-gradient(90deg,#071427,#0b1e2b)", padding: 10, borderRadius: 10, textAlign: "center" };
const statBig: React.CSSProperties = { fontWeight: 800, color: "#dbeafe" };
const statSmall: React.CSSProperties = { color: "#94a3b8", fontSize: 13 };

const footer: React.CSSProperties = { maxWidth: 1100, margin: "40px auto 10px", textAlign: "center", color: "#9aa6c0" };
