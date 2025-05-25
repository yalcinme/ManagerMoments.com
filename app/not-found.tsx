export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1b4b",
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404 - Page Not Found</h1>
        <p style={{ marginBottom: "2rem" }}>This page doesn't exist.</p>
        <a
          href="/"
          style={{
            color: "#60a5fa",
            textDecoration: "underline",
            fontSize: "1.1rem",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
