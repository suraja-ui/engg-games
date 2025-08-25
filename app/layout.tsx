import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engineering Games",
  description: "Learn Engineering with Fun & Games",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: "1px solid #eee",
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 10,
          }}
        >
          <a href="/" style={{ textDecoration: "none", fontWeight: 800 }}>
            Engg Games
          </a>
          <nav>
            <a href="/subjects" style={{ textDecoration: "none" }}>
              Subjects
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
