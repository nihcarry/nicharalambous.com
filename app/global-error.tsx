"use client";

/**
 * Root-level error boundary. Catches errors that bubble up from the app.
 * Handles "[object Event]" — which occurs when an Event (e.g. script load
 * failure) is stringified as an error message — by showing a friendly fallback.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isEventMessage =
    error?.message === "[object Event]" ||
    (typeof error?.message === "string" && error.message.includes("[object "));

  const displayMessage = isEventMessage
    ? "A client-side error occurred. This can happen when a script fails to load (for example, when blocked by an ad blocker)."
    : error?.message ?? "Something went wrong.";

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#f7f7f5" }}>
        <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.5rem", color: "#1a1a1a", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#555", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            {displayMessage}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
