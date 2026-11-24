import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import { createApp } from "./app.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4174);
const app = createApp();

// Serve built production frontend if dist exists (used by `npm run preview`)
const distDir = path.resolve(__dirname, "../dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, "127.0.0.1", () => {
  console.log(`[FDE-API] Running at http://127.0.0.1:${PORT}`);
});
