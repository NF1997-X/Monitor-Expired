import "dotenv/config";
import express from "express";
import { registerRoutes } from "../dist/routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

let isInitialized = false;

async function initializeApp() {
  if (!isInitialized) {
    await registerRoutes(app);
    
    // Serve static files from the dist/public directory
    app.use(express.static(path.join(__dirname, "../dist/public")));

    // Catch-all route to serve index.html for client-side routing
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../dist/public/index.html"));
    });
    
    isInitialized = true;
  }
}

export default async function handler(req, res) {
  await initializeApp();
  return app(req, res);
}
