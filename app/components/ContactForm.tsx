// app/components/ContactForm.tsx
'use client';

import React, { useState } from "react";

export default function ContactForm({ emailTo }: { emailTo: string }) {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  function composeMailTo() {
    // build a mailto: link with encoded subject/body
    const bodyLines = [
      name ? `From: ${name}` : "",
      fromEmail ? `Reply-to: ${fromEmail}` : "",
      "",
      message,
    ].join("\n");

    const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject || "Contact from website")}&body=${encodeURIComponent(bodyLines)}`;

    // open default mail client
    window.location.href = mailto;
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailTo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // ignore
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    composeMailTo();
  }

  return (
    <div style={wrap}>
      <h3 style={{ marginTop: 0 }}>Send a message</h3>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />
          <input
            placeholder="Your email (optional)"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            style={input}
          />
        </div>

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          style={{ ...input, resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="submit" style={btnPrimary}>Open email client</button>
          <button type="button" onClick={() => { setName(""); setFromEmail(""); setSubject(""); setMessage(""); }} style={btnGhost}>Clear</button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={copyEmail} type="button" style={btnSmall}>
              {copied ? "Copied!" : "Copy email"}
            </button>
            <a href={`mailto:${emailTo}`} style={btnLink}>Email directly</a>
          </div>
        </div>

        <div style={{ color: "#9aa6c0", fontSize: 13 }}>
          Note: this form opens your default email client using <code>mailto:</code>. If you want a server-based contact form (messages stored or emailed automatically), I can add a backend endpoint or integrate a service like Formspree / EmailJS.
        </div>
      </form>
    </div>
  );
}

/* styles */
const wrap: React.CSSProperties = {
  padding: 16,
  borderRadius: 12,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.03)",
};

const input: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(255,255,255,0.02)",
  color: "black", // make sure text inside inputs is readable
  fontSize: 14,
  width: "100%",
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  background: "#1a73e8",
  color: "white",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  background: "transparent",
  color: "#dbeafe",
  border: "1px solid rgba(255,255,255,0.06)",
  cursor: "pointer",
};

const btnSmall: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  background: "#10233a",
  color: "#dbeafe",
  border: "1px solid rgba(255,255,255,0.06)",
  cursor: "pointer",
};

const btnLink: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  background: "transparent",
  color: "#cfe0ff",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.04)",
};
