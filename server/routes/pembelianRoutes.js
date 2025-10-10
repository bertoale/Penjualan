import express from "express";
import {
  getAllPembelian,
  getPembelianById,
  createPembelian,
  updatePembelian,
  deletePembelian,
  getLaporanPembelian,
} from "../controllers/pembelianController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Semua routes memerlukan authentication
router.use(authenticateToken);

// Special routes
router.get("/laporan", authorizeRoles("admin", "owner"), getLaporanPembelian);

// CRUD routes untuk pembelian
router.get("/", authorizeRoles("admin", "owner"), getAllPembelian);
router.get("/:id", authorizeRoles("admin", "owner"), getPembelianById);
router.post("/", authorizeRoles("admin", "owner"), createPembelian);
router.put("/:id", authorizeRoles("admin", "owner"), updatePembelian);
router.delete("/:id", authorizeRoles("admin", "owner"), deletePembelian);

export default router;
