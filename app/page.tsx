// app/page.tsx
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <main style={page}>
      <header style={nav}>
        <div style={brand}>
          <div style={logo}>🚀</div>
          <div>
            <div style={brandTitle}>Engineering Games</div>
            <div style={brandSub}>Play. Visualize. Master engineering concepts.</div>
          </div>
        </div>

        <nav style={navLinks}>
          <Link href="/subjects" style={primaryNavLink}>Explore Subjects</Link>
          <Link href="/about" style={navLink}>About</Link>
          <Link href="/contact" style={navLink}>Contact</Link>
        </nav>
      </header>

      <section style={hero}>
        <div style={heroLeft}>
          <h1 style={heroTitle}>Learn engineering by doing — not by reading long paragraphs.</h1>

          <p style={heroSubtitle}>
            Short interactive simulations and micro-challenges for CSE, ECE & MECH — visual, hands-on, and built to spark curiosity.
          </p>

          <div style={ctaRow}>
            <Link href="/subjects" style={bigPrimaryBtn}>Explore Subjects</Link>
            <Link href="/about" style={secondaryBtn}>How it works</Link>
          </div>

          <div style={subjectCards}>
            <Card title="CSE" href="/subjects#cse" emoji="🖥️" bullets={["Stacks & Queues","Sorting Visualizer","Graphs"]} />
            <Card title="ECE" href="/subjects#ece" emoji="⚡" bullets={["DC/AC Circuits","RLC Sandbox","Diodes"]} />
            <Card title="MECH" href="/subjects#mech" emoji="⚙️" bullets={["Beams & Bending","Torque","SHM"]} />
          </div>

          <div style={statsRow}>
            <Stat icon="🎮" big="100+" text="Interactive mini-lessons" />
            <Stat icon="🏷️" big="3" text="Branches (CSE / ECE / MECH)" />
            <Stat icon="⭐" big="Levels" text="Challenges & XP" />
          </div>
        </div>

        <div style={heroRight}>
          <div style={mockupWrap}>
            <div style={mockupHeader}>Live previews</div>

            <div style={carousel}>
              <div style={{ ...carouselItem, background: "#f8fbff" }}>
                <div style={mockTitle}>Stacks — CSE</div>
                <div style={mockPreviewRow}>
                  <div style={stackNode}>10</div>
                  <div style={stackNode}>20</div>
                  <div style={stackNode}>30</div>
                </div>
                <div style={mockFooterRow}>
                  <Link href="/play/cse/stacks" style={mockOpen}>Open</Link>
                </div>
              </div>

              <div style={{ ...carouselItem, background: "#fff7f0" }}>
                <div style={mockTitle}>DC Circuit — ECE</div>
                <div style={circuitPreview}>
                  <div style={ligBox}>V</div>
                  <div style={resBox}>R</div>
                  <div style={resBox}>R</div>
                </div>
                <div style={mockFooterRow}>
                  <Link href="/play/ece/dc" style={mockOpen}>Open</Link>
                </div>
              </div>

              <div style={{ ...carouselItem, background: "#f0fff4" }}>
                <div style={mockTitle}>Beams — MECH</div>
                <div style={beamPreview}>
                  <div style={beamBar} />
                </div>
                <div style={mockFooterRow}>
                  <Link href="/play/mech/beams" style={mockOpen}>Open</Link>
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginTop: 18, color: "#e6eef8" }}>
            <strong>Quick peek</strong>
            <div style={{ marginTop: 8, color: "#cfe0ff" }}>Click "Open" on any preview to jump straight into the playable challenge.</div>
          </div>
        </div>
      </section>

      <section style={howItWorks}>
        <h3 style={{ margin: 0 }}>Why this works</h3>
        <div style={howGrid}>
          <InfoCard emoji="🔍" title="See it" text="Visualize internal states & math — not just outputs." />
          <InfoCard emoji="🧩" title="Try it" text="Interactive micro-experiments you can complete in minutes." />
          <InfoCard emoji="🎯" title="Improve" text="Small challenges with measurable progress and repeatable practice." />
        </div>
      </section>

      <footer style={footer}>
        <div style={{ fontWeight: 700 }}>Developed by SURAJA GOUDAR</div>
      </footer>
    </main>
  );
}

/* ---------- small subcomponents ---------- */

function Card({ title, href, emoji, bullets }: { title: string; href: string; emoji: string; bullets: string[] }) {
  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={cardIcon}>{emoji}</div>
        <div>
          <div style={{ fontWeight: 800 }}>{title}</div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>{bullets.join(" • ")}</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Link href={href} style={cardBtn}>Explore</Link>
      </div>
    </div>
  );
}

function Stat({ icon, big, text }: { icon: string; big: string; text: string }) {
  return (
    <div style={stat}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 18 }}>{big}</div>
      <div style={{ fontSize: 13, color: "#9aa6c0" }}>{text}</div>
    </div>
  );
}

function InfoCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div style={howCard}>
      <div style={{ fontSize: 22 }}>{emoji}</div>
      <div style={{ fontWeight: 800, marginTop: 8 }}>{title}</div>
      <div style={{ marginTop: 6, color: "#9aa6c0" }}>{text}</div>
    </div>
  );
}

/* ---------- styles (inline) ---------- */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#071028 0%, #0b1220 100%)",
  color: "#f8fafc",
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  padding: 28,
  boxSizing: "border-box",
};

const nav: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: 1100,
  margin: "0 auto 28px",
  width: "100%",
};

const brand: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };
const logo: React.CSSProperties = { fontSize: 28 };
const brandTitle: React.CSSProperties = { fontWeight: 800, fontSize: 16 };
const brandSub: React.CSSProperties = { fontSize: 12, opacity: 0.9 };

const navLinks: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };
const navLink: React.CSSProperties = { color: "#cbd5e1", textDecoration: "none", padding: "6px 8px" };
const primaryNavLink: React.CSSProperties = { padding: "8px 14px", borderRadius: 10, background: "#1a73e8", color: "#fff", fontWeight: 800, textDecoration: "none" };

const hero: React.CSSProperties = {
  maxWidth: 1100,
  margin: "10px auto",
  display: "flex",
  gap: 24,
  alignItems: "flex-start",
};

const heroLeft: React.CSSProperties = { flex: 1, minWidth: 320 };
const heroRight: React.CSSProperties = { width: 420, minWidth: 320 };

const heroTitle: React.CSSProperties = { fontSize: 36, margin: "6px 0 12px", color: "#fff" };
const heroSubtitle: React.CSSProperties = { color: "#cfe0ff", fontSize: 16, lineHeight: 1.5, marginBottom: 18 };

const ctaRow: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" };
const bigPrimaryBtn: React.CSSProperties = { padding: "14px 22px", borderRadius: 14, background: "#1a73e8", color: "#fff", fontWeight: 800, textDecoration: "none", fontSize: 16 };
const secondaryBtn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, background: "transparent", color: "#cfe0ff", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" };

const subjectCards: React.CSSProperties = { display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" };
const card: React.CSSProperties = { background: "#0b1228", padding: 14, borderRadius: 12, width: 240, boxShadow: "0 8px 20px rgba(2,6,23,0.6)", border: "1px solid rgba(255,255,255,0.03)" };
const cardIcon: React.CSSProperties = { fontSize: 22, background: "rgba(255,255,255,0.03)", padding: 8, borderRadius: 8 };
const cardBtn: React.CSSProperties = { marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "#10233a", color: "#dbeafe", textDecoration: "none", display: "inline-block", fontWeight: 700 };

const statsRow: React.CSSProperties = { display: "flex", gap: 12, marginTop: 18, alignItems: "center" };
const stat: React.CSSProperties = { background: "#061124", padding: 12, borderRadius: 10, minWidth: 160, textAlign: "center" };

const mockupWrap: React.CSSProperties = { borderRadius: 12, padding: 12, background: "linear-gradient(180deg,#ffffff, #f1f7ff)", color: "#071127", boxShadow: "0 12px 30px rgba(2,6,23,0.5)" };
const mockupHeader: React.CSSProperties = { fontWeight: 800, marginBottom: 10 };
const carousel: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 180,
  overflow: "hidden",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
};

const carouselItem: React.CSSProperties = {
  minWidth: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 12,
  boxSizing: "border-box",
  justifyContent: "space-between",
  animation: "carouselAnimation 12s linear infinite",
};

/* keyframes injected below as CSS string so no external CSS file needed */
const styleSheet = `
@keyframes carouselAnimation {
  0% { transform: translateX(0%); }
  25% { transform: translateX(0%); }
  33.333% { transform: translateX(-100%); }
  58.333% { transform: translateX(-100%); }
  66.666% { transform: translateX(-200%); }
  91.666% { transform: translateX(-200%); }
  100% { transform: translateX(0%); }
}
`;

/* small preview pieces */
const mockTitle: React.CSSProperties = { fontWeight: 800, color: "#07203a" };
const mockPreviewRow: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center" };
const stackNode: React.CSSProperties = { background: "#1a73e8", color: "black", padding: "8px 10px", borderRadius: 8, fontWeight: 800 };
const circuitPreview: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center" };
const ligBox: React.CSSProperties = { background: "#ffd54f", padding: "8px 10px", borderRadius: 8, fontWeight: 800 };
const resBox: React.CSSProperties = { background: "#f1f3f5", padding: "8px 10px", borderRadius: 8, fontWeight: 800, color: "#071127" };
const beamPreview: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", padding: 12 };
const beamBar: React.CSSProperties = { width: "80%", height: 12, background: "linear-gradient(90deg,#1a73e8,#34d399)", borderRadius: 8 };

const mockFooterRow: React.CSSProperties = { display: "flex", justifyContent: "flex-end" };
const mockOpen: React.CSSProperties = { padding: "8px 12px", background: "#0b5ed7", color: "white", borderRadius: 8, textDecoration: "none", fontWeight: 700 };

const howItWorks: React.CSSProperties = { maxWidth: 1100, margin: "40px auto 0", color: "#e6eef8" };
const howGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 12 };
const howCard: React.CSSProperties = { padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)" };

const footer: React.CSSProperties = { maxWidth: 1100, margin: "40px auto 10px", textAlign: "center", color: "#9aa6c0" };

/* inject keyframes into document when component runs (server-side doesn't execute this,
   but client will; this inline injection works across dev & prod when the page renders) */
if (typeof window !== "undefined") {
  const id = "eg-home-keyframes";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = styleSheet;
    document.head.appendChild(s);
  }
}
