// src/app.ts – express application skeleton
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet());
app.use(express.json());

// Health‑check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
