import express from "express";
import {
  getAllSupplier,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Semua routes memerlukan authentication
router.use(authenticateToken);

// CRUD routes untuk supplier
router.get("/", getAllSupplier);
router.get("/:id", getSupplierById);
router.post("/", authorizeRoles("admin", "owner"), createSupplier);
router.put("/:id", authorizeRoles("admin", "owner"), updateSupplier);
router.delete("/:id", authorizeRoles("admin", "owner"), deleteSupplier);

export default router;
