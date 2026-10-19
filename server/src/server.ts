// server.ts – application entry point
// Loads environment variables, starts the HTTP server, and manages graceful shutdown.
import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 8080;

const server = app.listen(PORT, () => {
  console.log(`[server] HAVEN API listening on http://localhost:${PORT}`);
  console.log(`[server] NODE_ENV=${process.env.NODE_ENV ?? "development"}`);
});

// Graceful shutdown – close the HTTP server on SIGTERM / SIGINT
function shutdown(signal: string) {
  console.log(`[server] ${signal} received – shutting down gracefully…`);
  server.close(() => {
    console.log("[server] HTTP server closed.");
    process.exit(0);
  });

  // Force-quit if the server hasn't closed within 10 s
  setTimeout(() => {
    console.error("[server] Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
