import express from "express";
import {
  getAllProduk,
  getProdukById,
  createProduk,
  updateProduk,
  updateStokProduk,
  deleteProduk,
  getProdukStokRendah,
  getProdukByKategori,
} from "../controllers/produkController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Semua routes memerlukan authentication
router.use(authenticateToken);

// Special routes
router.get("/stok-rendah", getProdukStokRendah);
router.get("/kategori/:kategoriId", getProdukByKategori);

// CRUD routes untuk produk
router.get("/", getAllProduk);
router.get("/:id", getProdukById);
router.post("/", authorizeRoles("admin", "owner"), createProduk);
router.put("/:id", authorizeRoles("admin", "owner"), updateProduk);
router.put("/:id/stok", authorizeRoles("admin", "owner"), updateStokProduk);
router.delete("/:id", authorizeRoles("admin", "owner"), deleteProduk);

export default router;
