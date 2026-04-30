"use client";

/**
 * Catches errors in the root layout. Must define its own <html> and <body>.
 * Prevents a totally blank window when the root layout fails.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#faf7f2",
          color: "#3d2b22",
          padding: "2rem",
          maxWidth: "36rem",
        }}
      >
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
          Something went wrong
        </h1>
        <pre
          style={{
            fontSize: "0.875rem",
            whiteSpace: "pre-wrap",
            background: "#f3ede3",
            padding: "1rem",
            borderRadius: "0.75rem",
          }}
        >
          {error.message}
        </pre>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1.25rem",
            borderRadius: "9999px",
            border: "none",
            background: "#c0668a",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
