import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ 
      maxWidth: 600, 
      margin: "100px auto", 
      padding: "0 16px", 
      textAlign: "center" 
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <div style={{ marginTop: 20 }}>
        <Link href="/" style={{ 
          color: "#0070f3", 
          textDecoration: "none",
          fontSize: 18
        }}>
          ← Go back home
        </Link>
      </div>
    </div>
  );
}
