import { Pelanggan } from "../models/index.js";
import { Op } from "sequelize";

// GET all pelanggan
export const getAllPelanggan = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { nama: { [Op.like]: `%${search}%` } },
          { no_hp: { [Op.like]: `%${search}%` } },
          { alamat: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows: pelanggan } = await Pelanggan.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      message: "Data pelanggan berhasil diambil",
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pelanggan,
    });
  } catch (error) {
    console.error("Get all pelanggan error:", error);
    res.status(500).json({
      message: "Gagal mengambil data pelanggan",
      error: error.message,
    });
  }
};

// GET single pelanggan by ID
export const getPelangganById = async (req, res) => {
  const pelangganId = req.params.id;

  try {
    // Validasi ID
    if (!pelangganId || isNaN(pelangganId)) {
      return res.status(400).json({ message: "ID pelanggan tidak valid" });
    }

    const pelanggan = await Pelanggan.findByPk(pelangganId);

    if (!pelanggan) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    res.json({
      message: "Data pelanggan berhasil diambil",
      pelanggan,
    });
  } catch (error) {
    console.error("Get pelanggan by ID error:", error);
    res.status(500).json({
      message: "Gagal mengambil data pelanggan",
      error: error.message,
    });
  }
};

// CREATE new pelanggan
export const createPelanggan = async (req, res) => {
  const { nama, no_hp, alamat } = req.body;

  try {
    // Validasi input
    if (!nama || nama.trim().length === 0) {
      return res.status(400).json({
        message: "Nama pelanggan harus diisi",
      });
    }

    // Cek apakah pelanggan dengan nama yang sama sudah ada
    const existingPelanggan = await Pelanggan.findOne({ where: { nama } });
    if (existingPelanggan) {
      return res.status(409).json({
        message: "Pelanggan dengan nama tersebut sudah ada",
      });
    }

    const newPelanggan = await Pelanggan.create({
      nama: nama.trim(),
      no_hp: no_hp?.trim() || null,
      alamat: alamat?.trim() || null,
    });

    res.status(201).json({
      message: "Pelanggan berhasil dibuat",
      pelanggan: newPelanggan,
    });
  } catch (error) {
    console.error("Create pelanggan error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Gagal membuat pelanggan",
      error: error.message,
    });
  }
};

// UPDATE pelanggan
export const updatePelanggan = async (req, res) => {
  const { nama, no_hp, alamat } = req.body;
  const pelangganId = req.params.id;

  try {
    // Validasi ID
    if (!pelangganId || isNaN(pelangganId)) {
      return res.status(400).json({ message: "ID pelanggan tidak valid" });
    }

    const pelanggan = await Pelanggan.findByPk(pelangganId);
    if (!pelanggan) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    // Validasi input jika ada perubahan
    if (nama && nama.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Nama pelanggan tidak boleh kosong" });
    }

    // Cek apakah nama baru sudah digunakan pelanggan lain
    if (nama && nama.trim() !== pelanggan.nama) {
      const existingPelanggan = await Pelanggan.findOne({
        where: { nama: nama.trim() },
        attributes: ["id"],
      });
      if (existingPelanggan && existingPelanggan.id !== parseInt(pelangganId)) {
        return res.status(409).json({
          message: "Nama pelanggan sudah digunakan oleh pelanggan lain",
        });
      }
    }

    await pelanggan.update({
      nama: nama?.trim() || pelanggan.nama,
      no_hp: no_hp?.trim() || pelanggan.no_hp,
      alamat: alamat?.trim() || pelanggan.alamat,
    });

    res.json({
      message: "Pelanggan berhasil diupdate",
      pelanggan,
    });
  } catch (error) {
    console.error("Update pelanggan error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Gagal update pelanggan",
      error: error.message,
    });
  }
};

// DELETE pelanggan
export const deletePelanggan = async (req, res) => {
  const pelangganId = req.params.id;

  try {
    // Validasi ID
    if (!pelangganId || isNaN(pelangganId)) {
      return res.status(400).json({ message: "ID pelanggan tidak valid" });
    }

    const pelanggan = await Pelanggan.findByPk(pelangganId);
    if (!pelanggan) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    }

    // TODO: Cek apakah pelanggan memiliki transaksi penjualan
    // Jika ada, mungkin tidak boleh dihapus atau kasih warning

    await pelanggan.destroy();
    res.json({
      message: "Pelanggan berhasil dihapus",
      deletedPelanggan: {
        id: pelanggan.id,
        nama: pelanggan.nama,
      },
    });
  } catch (error) {
    console.error("Delete pelanggan error:", error);
    res.status(500).json({
      message: "Gagal menghapus pelanggan",
      error: error.message,
    });
  }
};
