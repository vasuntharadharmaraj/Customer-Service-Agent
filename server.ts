import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { processAgentRequest } from "./server/agent/engine.js";
import { db } from "./server/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Agentic Chat Processing
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history = [], activeOrderId } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const response = await processAgentRequest(message, history, activeOrderId);
      return res.json(response);
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      return res.status(500).json({
        error: "Internal server error during agent processing.",
        details: err?.message || String(err)
      });
    }
  });

  // API Route: Database state snapshot (orders, products, faqs, tickets, escalations)
  app.get("/api/database", (_req: Request, res: Response) => {
    res.json({
      products: db.getAllProducts(),
      orders: db.getAllOrders(),
      faqs: db.getAllFAQs(),
      tickets: db.getAllTickets(),
      escalations: db.getAllEscalations()
    });
  });

  // API Route: Reset simulation database
  app.post("/api/reset", (_req: Request, res: Response) => {
    db.reset();
    res.json({
      success: true,
      message: "Simulation database reset to factory state.",
      products: db.getAllProducts(),
      orders: db.getAllOrders(),
      faqs: db.getAllFAQs(),
      tickets: db.getAllTickets(),
      escalations: db.getAllEscalations()
    });
  });

  // Vite Integration
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartServe AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
