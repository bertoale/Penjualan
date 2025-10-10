import express from "express";
import {
  getAllPelanggan,
  getPelangganById,
  createPelanggan,
  updatePelanggan,
  deletePelanggan,
} from "../controllers/pelangganController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Semua routes memerlukan authentication
router.use(authenticateToken);

// CRUD routes untuk pelanggan
router.get("/", getAllPelanggan);
router.get("/:id", getPelangganById);
router.post("/", createPelanggan);
router.put("/:id", updatePelanggan);
router.delete("/:id", authorizeRoles("admin", "owner"), deletePelanggan);

export default router;
