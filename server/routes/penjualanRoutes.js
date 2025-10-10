import express from "express";
import {
  getAllPenjualan,
  getPenjualanById,
  createPenjualan,
  updatePenjualan,
  deletePenjualan,
  getLaporanPenjualan,
} from "../controllers/penjualanController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Semua routes memerlukan authentication
router.use(authenticateToken);

// Special routes
router.get("/laporan", authorizeRoles("admin", "owner"), getLaporanPenjualan);

// CRUD routes untuk penjualan
router.get("/", getAllPenjualan);
router.get("/:id", getPenjualanById);
router.post("/", createPenjualan);
router.put("/:id", authorizeRoles("admin", "owner"), updatePenjualan);
router.delete("/:id", authorizeRoles("admin", "owner"), deletePenjualan);

export default router;
