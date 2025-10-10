import express from "express";
import {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} from "../controllers/produkKategoriController.js";

const router = express.Router();

// GET all kategori
router.get("/", getAllKategori);

// GET kategori by ID
router.get("/:id", getKategoriById);

// CREATE kategori
router.post("/", createKategori);

// UPDATE kategori
router.put("/:id", updateKategori);

// DELETE kategori
router.delete("/:id", deleteKategori);

export default router;
