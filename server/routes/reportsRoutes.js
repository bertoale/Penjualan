import express from "express";
import {
  generateSalesReport,
  generatePurchaseReport,
  generateCombinedReport,
} from "../controllers/reportsController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Semua routes memerlukan authentication dan role admin/owner
router.use(authenticateToken);
router.use(authorizeRoles("admin", "owner"));

// Report generation routes
router.get("/sales", generateSalesReport);
router.get("/purchases", generatePurchaseReport);
router.get("/combined", generateCombinedReport);

export default router;
