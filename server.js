import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import { swaggerDocs } from "./swagger.js";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import authorRoutes from "./routes/authors.js";
import contactRoutes from "./routes/contacts.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// ==================== CORS FIX ====================
// Explicit CORS config to support Swagger UI and Render
app.use(
  cors({
    origin: "*", // Allow all origins (for demo & Swagger); restrict to specific domains in production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);
// Handle preflight (OPTIONS) requests globally
app.options("*", cors());

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(morgan("dev"));

// ==================== ROOT ENDPOINT ====================
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to BookHub API" });
});

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);

// ==================== SWAGGER ====================
swaggerDocs(app);

// ==================== DATABASE + SERVER START ====================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📘 Swagger available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

export default app;
