import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import {
  authenticateToken,
  authorizeRoles,
  authorizeUserOrAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Authentication routes (public)
router.post("/login", loginUser);
router.post("/register", createUser); // Bisa diubah jadi protected jika diperlukan
router.post("/logout", authenticateToken, logoutUser);

// Profile routes
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

// Protected routes - memerlukan authentication
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  getAllUsers
);
router.get("/:id", authenticateToken, authorizeUserOrAdmin, getUserById);
router.put("/:id", authenticateToken, authorizeUserOrAdmin, updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

export default router;
