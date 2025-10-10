import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// LOGIN user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validasi input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password harus diisi" });
    }

    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie httpOnly agar bisa digunakan di Postman
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true jika di production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat login", error: error.message });
  }
};

// LOGOUT user (hapus cookie)
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
};

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json({
      message: "Data users berhasil diambil",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      message: "Gagal mengambil data users",
      error: error.message,
    });
  }
};

// GET single user by ID
export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Validasi ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "ID user tidak valid" });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
};

// CREATE new user (Register)
export const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validasi input
    if (!username || !password || !role) {
      return res.status(400).json({
        message: "Username, password, dan role harus diisi",
      });
    }

    // Validasi panjang password
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    // Validasi role
    const validRoles = ["admin", "kasir", "owner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Role harus salah satu dari: admin, kasir, owner",
      });
    }

    // Cek apakah username sudah ada
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        message: "Username sudah digunakan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    // Menghilangkan password dari response
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      message: "User berhasil dibuat",
      user: userResponse,
    });
  } catch (error) {
    console.error("Create user error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Username sudah digunakan",
      });
    }

    res.status(500).json({
      message: "Gagal membuat user",
      error: error.message,
    });
  }
};

// GET current user profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user sudah di-set oleh authenticateToken middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      message: "Profile berhasil diambil",
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      message: "Gagal mengambil profile user",
      error: error.message,
    });
  }
};

// UPDATE current user profile
export const updateUserProfile = async (req, res) => {
  const { username, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Validasi input jika ada perubahan
    if (username && username.trim().length === 0) {
      return res.status(400).json({ message: "Username tidak boleh kosong" });
    }

    if (password && password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    // Cek apakah username baru sudah digunakan user lain
    if (username && username.trim() !== user.username) {
      const existingUser = await User.findOne({
        where: { username: username.trim() },
        attributes: ["id"],
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          message: "Username sudah digunakan oleh user lain",
        });
      }
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await user.update({
      username: username?.trim() || user.username,
      password: hashedPassword,
    });

    // Response tanpa password
    const userResponse = {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      message: "Profile berhasil diupdate",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update user profile error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Username sudah digunakan",
      });
    }

    res.status(500).json({
      message: "Gagal update profile",
      error: error.message,
    });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  const { username, password, role } = req.body;
  const userId = req.params.id;

  try {
    // Validasi ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "ID user tidak valid" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Validasi input jika ada perubahan
    if (username && username.trim().length === 0) {
      return res.status(400).json({ message: "Username tidak boleh kosong" });
    }

    if (password && password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    if (role && !["admin", "kasir", "owner"].includes(role)) {
      return res.status(400).json({
        message: "Role harus salah satu dari: admin, kasir, owner",
      });
    }

    // Cek apakah username baru sudah digunakan user lain
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        where: { username },
        attributes: ["id"],
      });
      if (existingUser && existingUser.id !== parseInt(userId)) {
        return res.status(409).json({
          message: "Username sudah digunakan oleh user lain",
        });
      }
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await user.update({
      username: username || user.username,
      password: hashedPassword,
      role: role || user.role,
    });

    // Response tanpa password
    const userResponse = {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      message: "User berhasil diupdate",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update user error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Username sudah digunakan",
      });
    }

    res.status(500).json({
      message: "Gagal update user",
      error: error.message,
    });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Validasi ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "ID user tidak valid" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Mencegah penghapusan user terakhir (optional)
    const userCount = await User.count();
    if (userCount === 1) {
      return res.status(403).json({
        message: "Tidak dapat menghapus user terakhir",
      });
    }

    await user.destroy();
    res.json({
      message: "User berhasil dihapus",
      deletedUser: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Gagal menghapus user",
      error: error.message,
    });
  }
};
