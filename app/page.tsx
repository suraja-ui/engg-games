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
            <div style={brandSub}>Learn engineering with playful, tiny interactive games</div>
          </div>
        </div>

        <nav style={navLinks}>
          {/* Highlighted primary action: Explore Subjects */}
          <Link href="/subjects" style={primaryNavLink}>Explore Subjects</Link>

          {/* Secondary helpful links */}
          <Link href="/about" style={navLink}>About</Link>
          <Link href="/contact" style={navLink}>Contact</Link>
        </nav>
      </header>

      <section style={hero}>
        <div style={heroLeft}>
          <h1 style={heroTitle}>Turn tough engineering concepts into playable experiments.</h1>

          <p style={heroSubtitle}>
            Bite-sized interactive games and simulators for CSE, ECE & MECH — visual explanations,
            short challenges, and instant feedback. Perfect for classroom demos and self-study.
          </p>

          <div style={ctaRow}>
            {/* primary CTA (big & highlighted) */}
            <Link href="/subjects" style={bigPrimaryBtn}>Explore Subjects</Link>

            {/* one supporting link */}
            <Link href="/about" style={secondaryBtn}>How it works</Link>
          </div>

          <ul style={featureList}>
            <li><strong>Interactive</strong> — run, tweak and visualize simulations (circuits, beams, graphs).</li>
            <li><strong>Short challenges</strong> — quick objectives with immediate feedback.</li>
            <li><strong>Progress</strong> — levels & XP to keep learning fun.</li>
          </ul>
        </div>

        <div style={heroRight}>
          <div style={mockup}>
            <div style={mockupHeader}>Live preview: Stacks — CSE</div>

            <div style={mockupStage}>
              <div style={node}>10</div>
              <div style={node}>20</div>
              <div style={node}>30</div>

              <div style={mockupPanel}>
                <div style={mpTitle}>Try a short challenge</div>
                <div style={mpText}>Push & Pop elements correctly to win ⭐</div>
                <div style={mpBtnRow}>
                  <Link href="/play/cse/stacks" style={mpBtnPrimary}>Open Challenge</Link>
                  <Link href="/subjects#cse" style={mpBtn}>See CSE Topics</Link>
                </div>
              </div>
            </div>
          </div>

          <div style={quickStats}>
            <div><strong>500+</strong> mini-lessons planned</div>
            <div><strong>3 branches</strong> (CSE, ECE, MECH) — and more coming</div>
            <div><strong>Hinting</strong> & tutor suggestions planned (AI)</div>
          </div>
        </div>
      </section>

      <section style={howItWorks}>
        <h3 style={{margin:0}}>How it works</h3>
        <div style={howGrid}>
          <div style={howCard}>
            <div style={howIcon}>🎯</div>
            <h4>Short Goals</h4>
            <p>Each activity has a small, measurable objective — solve it to progress.</p>
          </div>
          <div style={howCard}>
            <div style={howIcon}>⚙️</div>
            <h4>Interactive Simulators</h4>
            <p>Tweak real variables and see how theory maps to behavior immediately.</p>
          </div>
          <div style={howCard}>
            <div style={howIcon}>📈</div>
            <h4>Track Progress</h4>
            <p>Earn stars and track your learning across topics and branches.</p>
          </div>
        </div>
      </section>

      <footer style={footer}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          Developed by SURAJA GOUDAR
        </div>
      </footer>
    </main>
  );
}

/* ---------- inline styles ---------- */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b1220",
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
const heroSubtitle: React.CSSProperties = { color: "#d1d9e6", fontSize: 16, lineHeight: 1.5, marginBottom: 18 };

const ctaRow: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" };
const bigPrimaryBtn: React.CSSProperties = { padding: "14px 22px", borderRadius: 14, background: "#1a73e8", color: "#fff", fontWeight: 800, textDecoration: "none", fontSize: 16 };
const secondaryBtn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, background: "#111827", color: "#e6eef8", border: "1px solid #2b3442", textDecoration: "none" };

const featureList: React.CSSProperties = { marginTop: 18, listStyle: "disc", paddingLeft: 18, color: "#e6eef8" };
const mockup: React.CSSProperties = { borderRadius: 12, background: "#fff", color: "#0b1220", padding: 16, boxShadow: "0 8px 30px rgba(2,6,23,0.6)" };
const mockupHeader: React.CSSProperties = { fontWeight: 800, marginBottom: 10, color: "#0b1220" };
const mockupStage: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center" };
const node: React.CSSProperties = { background: "#1a73e8", color: "black", padding: "8px 10px", borderRadius: 8, fontWeight: 700 };
const mockupPanel: React.CSSProperties = { marginLeft: 8, flex: 1, padding: 10, borderRadius: 8, border: "1px solid #e6eef8" };
const mpTitle: React.CSSProperties = { fontWeight: 800, color: "#0b1220" };
const mpText: React.CSSProperties = { color: "#263348", marginTop: 6 };
const mpBtnRow: React.CSSProperties = { display: "flex", gap: 8, marginTop: 10 };
const mpBtnPrimary: React.CSSProperties = { padding: "8px 12px", background: "#1a73e8", color: "white", borderRadius: 8, border: "none", textDecoration: "none" };
const mpBtn: React.CSSProperties = { padding: "8px 12px", background: "#f1f5f9", color: "#0b1220", borderRadius: 8, border: "none", textDecoration: "none" };

const quickStats: React.CSSProperties = { marginTop: 12, color: "#e6eef8", lineHeight: 1.6 };

const howItWorks: React.CSSProperties = { maxWidth: 1100, margin: "40px auto 0", color: "#e6eef8" };
const howGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 12 };
const howCard: React.CSSProperties = { padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)" };
const howIcon: React.CSSProperties = { fontSize: 22 };

const footer: React.CSSProperties = { maxWidth: 1100, margin: "40px auto 10px", textAlign: "center", color: "#9aa6c0" };
