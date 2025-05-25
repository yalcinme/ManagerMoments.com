"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dc2626",
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong!</h1>
        <p style={{ marginBottom: "2rem" }}>An error occurred.</p>
        <button
          onClick={reset}
          style={{
            backgroundColor: "white",
            color: "#dc2626",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            color: "#fca5a5",
            textDecoration: "underline",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
