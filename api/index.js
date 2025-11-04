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

// Logging middleware
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
      console.log(logLine);
    }
  });

  next();
});

let isInitialized = false;

async function initialize() {
  if (!isInitialized) {
    await registerRoutes(app);
    
    // Serve static files
    app.use(express.static(path.join(__dirname, "../dist/public")));
    
    // Catch-all for SPA routing
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../dist/public/index.html"));
    });
    
    isInitialized = true;
  }
}

// Initialize immediately
initialize().catch(err => {
  console.error("Failed to initialize app:", err);
});

export default app;
