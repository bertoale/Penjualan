import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

// Middleware untuk verifikasi JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    // Ambil token dari header atau cookie
    let token = null;
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Token akses diperlukan",
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek apakah user masih ada di database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({
        message: "Token tidak valid - user tidak ditemukan",
      });
    }

    // Tambahkan user info ke request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token tidak valid",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token sudah expired",
      });
    }

    return res.status(500).json({
      message: "Terjadi kesalahan saat verifikasi token",
      error: error.message,
    });
  }
};

// Middleware untuk authorization berdasarkan role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "User tidak terautentikasi",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Akses ditolak. Diperlukan role: ${roles.join(" atau ")}`,
      });
    }

    next();
  };
};

// Middleware untuk memastikan user hanya bisa akses data dirinya sendiri atau admin
export const authorizeUserOrAdmin = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id);
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  if (currentUserRole === "admin" || currentUserId === requestedUserId) {
    next();
  } else {
    return res.status(403).json({
      message: "Akses ditolak. Anda hanya bisa mengakses data Anda sendiri",
    });
  }
};
