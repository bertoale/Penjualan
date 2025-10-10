import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from "./models/index.js";
import cookieParser from "cookie-parser";

// Import modul route
import userRoutes from "./routes/userRoutes.js";
import pelangganRoutes from "./routes/pelangganRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import produkRoutes from "./routes/produkRoutes.js";
import produkKategoriRoutes from "./routes/produkKategoriRoutes.js";
import penjualanRoutes from "./routes/penjualanRoutes.js";
import pembelianRoutes from "./routes/pembelianRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Ganti sesuai alamat frontend kamu
    credentials: true, // ✅ Harus ada agar cookie bisa dikirim
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Error handling middleware untuk JSON parsing
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/produk-kategori", produkKategoriRoutes);
app.use("/api/penjualan", penjualanRoutes);
app.use("/api/pembelian", pembelianRoutes);
app.use("/api/reports", reportsRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "API Penjualan Server is running!",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);
  res.status(500).json({
    message: "Terjadi kesalahan internal server",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal Server Error",
  });
});

sequelize
  .sync({
    alter: true, // gunakan { force: true } untuk development reset total
  })
  .then(() => {
    console.log("✅ Database connected & synced");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke database:", err.message);
  });
