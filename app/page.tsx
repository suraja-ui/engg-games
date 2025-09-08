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
            <div style={brandSub}>Learn engineering with fun, tiny games</div>
          </div>
        </div>
        <nav style={navLinks}>
          <Link href="/subjects"><a style={navLink}>Subjects</a></Link>
          <Link href="/play"><a style={navLink}>Play</a></Link>
          <Link href="/about"><a style={cta}>Get Started</a></Link>
        </nav>
      </header>

      <section style={hero}>
        <div style={heroLeft}>
          <h1 style={heroTitle}>Master engineering concepts — by playing.</h1>
          <p style={heroSubtitle}>
            Tiny interactive games and simulations for every engineering branch.
            Visualize concepts, solve challenges, earn progress — designed for
            beginners and students who prefer learning by doing.
          </p>

          <div style={ctaRow}>
            <Link href="/play"><a style={primaryBtn}>Start Learning</a></Link>
            <Link href="/subjects"><a style={secondaryBtn}>Explore Subjects</a></Link>
            <button
              onClick={() => window.scrollBy({ top: 800, behavior: "smooth" })}
              style={ghostBtn}
            >
              How it works
            </button>
          </div>

          <ul style={featureList}>
            <li><strong>Interactive</strong> games: stacks, queues, beams, circuits, graphs.</li>
            <li><strong>Visual & hands-on</strong> — see the math and the animation together.</li>
            <li><strong>Progress & challenges</strong> — levels, XP and short challenges.</li>
          </ul>

          <div style={trusted}>
            <span style={{fontWeight:700}}>Used in classrooms & self-study</span>
            <div style={{opacity:0.85, marginTop:6}}>Fast experiments • Instant feedback • Friendly UI</div>
          </div>
        </div>

        <div style={heroRight}>
          <div style={mockup}>
            {/* simple mockup boxes — replace with a screenshot / SVG if you like */}
            <div style={mockupHeader}>Play: Beams  •  MECH</div>
            <div style={mockupStage}>
              <div style={node}>R1</div>
              <div style={node}>R2</div>
              <div style={node}>R3</div>
              <div style={mockupPanel}>
                <div style={mpTitle}>Challenge</div>
                <div style={mpText}>Match max deflection within ±5%</div>
                <div style={mpBtnRow}>
                  <button style={mpBtnPrimary}>Play</button>
                  <button style={mpBtn}>Reset</button>
                </div>
              </div>
            </div>
          </div>

          <div style={quickStats}>
            <div><strong>500+</strong> interactive mini-lessons</div>
            <div><strong>3 branches</strong> (CSE, ECE, MECH) — expand as you like</div>
            <div><strong>AI Tutor</strong> coming for hints & explanations</div>
          </div>
        </div>
      </section>

      <section style={howItWorks}>
        <h3 style={{margin:0}}>How it works</h3>
        <div style={howGrid}>
          <div style={howCard}>
            <div style={howIcon}>🎯</div>
            <h4>Goals & Challenges</h4>
            <p>Short, clear tasks for each concept — win stars and track progress.</p>
          </div>
          <div style={howCard}>
            <div style={howIcon}>⚙️</div>
            <h4>Interactive Simulations</h4>
            <p>Change values, see results instantly — learn why equations behave that way.</p>
          </div>
          <div style={howCard}>
            <div style={howIcon}>📈</div>
            <h4>Measure Learning</h4>
            <p>Score, XP and levels to motivate steady improvement.</p>
          </div>
        </div>
      </section>

      <footer style={footer}>
        <div>© {new Date().getFullYear()} Engineering Games — built with ❤️</div>
        <div style={{opacity:0.8}}>suraja@example.com • kavya@example.com</div>
      </footer>
    </main>
  );
}

/* ---------- styles (inline for copy/paste) ---------- */

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
const cta: React.CSSProperties = { color: "#0b1220", background: "#fff", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 };

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
const primaryBtn: React.CSSProperties = { padding: "12px 18px", borderRadius: 12, background: "#1a73e8", color: "#fff", fontWeight: 800, textDecoration: "none" };
const secondaryBtn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, background: "#111827", color: "#e6eef8", border: "1px solid #2b3442" };
const ghostBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, background: "transparent", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.06)" };

const featureList: React.CSSProperties = { marginTop: 18, listStyle: "disc", paddingLeft: 18, color: "#e6eef8" };
const trusted: React.CSSProperties = { marginTop: 18, padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", width: "fit-content" };

const mockup: React.CSSProperties = { borderRadius: 12, background: "#fff", color: "#0b1220", padding: 16, boxShadow: "0 8px 30px rgba(2,6,23,0.6)" };
const mockupHeader: React.CSSProperties = { fontWeight: 800, marginBottom: 10, color: "#0b1220" };
const mockupStage: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center" };
const node: React.CSSProperties = { background: "#1a73e8", color: "black", padding: "10px 12px", borderRadius: 8, fontWeight: 700 };
const mockupPanel: React.CSSProperties = { marginLeft: 8, flex: 1, padding: 10, borderRadius: 8, border: "1px solid #e6eef8" };
const mpTitle: React.CSSProperties = { fontWeight: 800, color: "#0b1220" };
const mpText: React.CSSProperties = { color: "#263348", marginTop: 6 };
const mpBtnRow: React.CSSProperties = { display: "flex", gap: 8, marginTop: 10 };
const mpBtnPrimary: React.CSSProperties = { padding: "8px 12px", background: "#1a73e8", color: "white", borderRadius: 8, border: "none" };
const mpBtn: React.CSSProperties = { padding: "8px 12px", background: "#f1f5f9", color: "#0b1220", borderRadius: 8, border: "none" };

const quickStats: React.CSSProperties = { marginTop: 12, color: "#e6eef8", lineHeight: 1.6 };

const howItWorks: React.CSSProperties = { maxWidth: 1100, margin: "40px auto 0", color: "#e6eef8" };
const howGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 12 };
const howCard: React.CSSProperties = { padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)" };
const howIcon: React.CSSProperties = { fontSize: 22 };

const footer: React.CSSProperties = { maxWidth: 1100, margin: "40px auto 10px", textAlign: "center", color: "#9aa6c0" };
