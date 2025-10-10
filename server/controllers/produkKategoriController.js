import { ProdukKategori, Produk } from "../models/index.js";
import { Op } from "sequelize";

// GET all kategori
export const getAllKategori = async (req, res) => {
  try {
    const kategori = await ProdukKategori.findAll({
      order: [["nama", "ASC"]],
    });
    res.json({
      message: "Data kategori berhasil diambil",
      count: kategori.length,
      kategori,
    });
  } catch (error) {
    console.error("Get all kategori error:", error);
    res.status(500).json({
      message: "Gagal mengambil data kategori",
      error: error.message,
    });
  }
};

// GET single kategori by ID
export const getKategoriById = async (req, res) => {
  const kategoriId = req.params.id;
  try {
    if (!kategoriId || isNaN(kategoriId)) {
      return res.status(400).json({ message: "ID kategori tidak valid" });
    }
    const kategori = await ProdukKategori.findByPk(kategoriId);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.json({
      message: "Data kategori berhasil diambil",
      kategori,
    });
  } catch (error) {
    console.error("Get kategori by ID error:", error);
    res.status(500).json({
      message: "Gagal mengambil data kategori",
      error: error.message,
    });
  }
};

// CREATE kategori
export const createKategori = async (req, res) => {
  const { nama } = req.body;
  try {
    if (!nama || nama.trim().length === 0) {
      return res.status(400).json({ message: "Nama kategori harus diisi" });
    }
    const exist = await ProdukKategori.findOne({
      where: { nama: nama.trim() },
    });
    if (exist) {
      return res.status(409).json({ message: "Kategori sudah ada" });
    }
    const kategori = await ProdukKategori.create({ nama: nama.trim() });
    res.status(201).json({
      message: "Kategori berhasil dibuat",
      kategori,
    });
  } catch (error) {
    console.error("Create kategori error:", error);
    res.status(500).json({
      message: "Gagal membuat kategori",
      error: error.message,
    });
  }
};

// UPDATE kategori
export const updateKategori = async (req, res) => {
  const kategoriId = req.params.id;
  const { nama } = req.body;
  try {
    if (!kategoriId || isNaN(kategoriId)) {
      return res.status(400).json({ message: "ID kategori tidak valid" });
    }
    const kategori = await ProdukKategori.findByPk(kategoriId);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    if (!nama || nama.trim().length === 0) {
      return res.status(400).json({ message: "Nama kategori harus diisi" });
    }
    const exist = await ProdukKategori.findOne({
      where: { nama: nama.trim(), id: { [Op.ne]: kategori.id } },
    });
    if (exist) {
      return res.status(409).json({ message: "Kategori sudah ada" });
    }
    await kategori.update({ nama: nama.trim() });
    res.json({
      message: "Kategori berhasil diupdate",
      kategori,
    });
  } catch (error) {
    console.error("Update kategori error:", error);
    res.status(500).json({
      message: "Gagal update kategori",
      error: error.message,
    });
  }
};

// DELETE kategori
export const deleteKategori = async (req, res) => {
  const kategoriId = req.params.id;
  try {
    if (!kategoriId || isNaN(kategoriId)) {
      return res.status(400).json({ message: "ID kategori tidak valid" });
    }
    const kategori = await ProdukKategori.findByPk(kategoriId);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    // Cek apakah ada produk terkait
    const produkCount = await Produk.count({
      where: { ProdukKategoriId: kategori.id },
    });
    if (produkCount > 0) {
      return res.status(400).json({
        message: "Tidak bisa hapus kategori yang masih dipakai produk",
      });
    }
    await kategori.destroy();
    res.json({
      message: "Kategori berhasil dihapus",
      deletedKategori: { id: kategori.id, nama: kategori.nama },
    });
  } catch (error) {
    console.error("Delete kategori error:", error);
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: error.message,
    });
  }
};
