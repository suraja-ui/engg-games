// app/contact/page.tsx
import React from "react";
import Link from "next/link";
import ContactForm from "@/app/components/ContactForm";

export default function ContactPage() {
  return (
    <main style={page}>
      <section style={container}>
        <h1 style={title}>Contact</h1>

        <div style={grid}>
          <div style={left}>
            <h2 style={{ marginTop: 0 }}>Get in touch</h2>
            <p style={{ color: "#cfe0ff" }}>
              I’d love to hear from you — whether it’s feedback about Engineering Games,
              collaboration ideas, or anything else.
            </p>

            <div style={card}>
              <div style={label}>Email</div>
              <a href="mailto:surajearlybird@gmail.com" style={link}>surajearlybird@gmail.com</a>
            </div>

            <div style={card}>
              <div style={label}>LinkedIn</div>
              <a href="https://www.linkedin.com/in/suraja-goudar-0a833b316" target="_blank" rel="noreferrer" style={link}>
                www.linkedin.com/in/suraja-goudar-0a833b316
              </a>
            </div>

            <div style={{ marginTop: 18 }}>
              <p style={{ color: "#cfe0ff" }}>
                Prefer to send a quick message? Use the form on the right — your default mail
                client will open with the composed message.
              </p>
            </div>
          </div>

          <div style={right}>
            {/* client-side contact form */}
            <ContactForm emailTo="surajearlybird@gmail.com" />
          </div>
        </div>
      </section>
    </main>
  );
}

/* styles */
const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#071028 0%, #0b1220 100%)",
  color: "#f8fafc",
  padding: 28,
  fontFamily: "Inter, system-ui, sans-serif",
  boxSizing: "border-box",
};

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "18px auto",
};

const title: React.CSSProperties = { fontSize: 32, marginBottom: 8 };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 420px", gap: 28, alignItems: "start" };

const left: React.CSSProperties = {};
const right: React.CSSProperties = {};

const card: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 10,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.03)",
};

const label: React.CSSProperties = { color: "#9aa6c0", fontSize: 13, marginBottom: 6, fontWeight: 700 };
const link: React.CSSProperties = { color: "#dbeafe", textDecoration: "none", fontWeight: 700 };
