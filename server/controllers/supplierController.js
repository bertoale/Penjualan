import { Supplier } from "../models/index.js";
import { Op } from "sequelize";

// GET all supplier
export const getAllSupplier = async (req, res) => {
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

    const { count, rows: supplier } = await Supplier.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      message: "Data supplier berhasil diambil",
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      supplier,
    });
  } catch (error) {
    console.error("Get all supplier error:", error);
    res.status(500).json({
      message: "Gagal mengambil data supplier",
      error: error.message,
    });
  }
};

// GET single supplier by ID
export const getSupplierById = async (req, res) => {
  const supplierId = req.params.id;

  try {
    // Validasi ID
    if (!supplierId || isNaN(supplierId)) {
      return res.status(400).json({ message: "ID supplier tidak valid" });
    }

    const supplier = await Supplier.findByPk(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier tidak ditemukan" });
    }

    res.json({
      message: "Data supplier berhasil diambil",
      supplier,
    });
  } catch (error) {
    console.error("Get supplier by ID error:", error);
    res.status(500).json({
      message: "Gagal mengambil data supplier",
      error: error.message,
    });
  }
};

// CREATE new supplier
export const createSupplier = async (req, res) => {
  const { nama, no_hp, alamat } = req.body;

  try {
    // Validasi input
    if (!nama || nama.trim().length === 0) {
      return res.status(400).json({
        message: "Nama supplier harus diisi",
      });
    }

    // Cek apakah supplier dengan nama yang sama sudah ada
    const existingSupplier = await Supplier.findOne({ where: { nama } });
    if (existingSupplier) {
      return res.status(409).json({
        message: "Supplier dengan nama tersebut sudah ada",
      });
    }

    const newSupplier = await Supplier.create({
      nama: nama.trim(),
      no_hp: no_hp?.trim() || null,
      alamat: alamat?.trim() || null,
    });

    res.status(201).json({
      message: "Supplier berhasil dibuat",
      supplier: newSupplier,
    });
  } catch (error) {
    console.error("Create supplier error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Gagal membuat supplier",
      error: error.message,
    });
  }
};

// UPDATE supplier
export const updateSupplier = async (req, res) => {
  const { nama, no_hp, alamat } = req.body;
  const supplierId = req.params.id;

  try {
    // Validasi ID
    if (!supplierId || isNaN(supplierId)) {
      return res.status(400).json({ message: "ID supplier tidak valid" });
    }

    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier tidak ditemukan" });
    }

    // Validasi input jika ada perubahan
    if (nama && nama.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Nama supplier tidak boleh kosong" });
    }

    // Cek apakah nama baru sudah digunakan supplier lain
    if (nama && nama.trim() !== supplier.nama) {
      const existingSupplier = await Supplier.findOne({
        where: { nama: nama.trim() },
        attributes: ["id"],
      });
      if (existingSupplier && existingSupplier.id !== parseInt(supplierId)) {
        return res.status(409).json({
          message: "Nama supplier sudah digunakan oleh supplier lain",
        });
      }
    }

    await supplier.update({
      nama: nama?.trim() || supplier.nama,
      no_hp: no_hp?.trim() || supplier.no_hp,
      alamat: alamat?.trim() || supplier.alamat,
    });

    res.json({
      message: "Supplier berhasil diupdate",
      supplier,
    });
  } catch (error) {
    console.error("Update supplier error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Gagal update supplier",
      error: error.message,
    });
  }
};

// DELETE supplier
export const deleteSupplier = async (req, res) => {
  const supplierId = req.params.id;

  try {
    // Validasi ID
    if (!supplierId || isNaN(supplierId)) {
      return res.status(400).json({ message: "ID supplier tidak valid" });
    }

    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier tidak ditemukan" });
    }

    // TODO: Cek apakah supplier memiliki transaksi pembelian
    // Jika ada, mungkin tidak boleh dihapus atau kasih warning

    await supplier.destroy();
    res.json({
      message: "Supplier berhasil dihapus",
      deletedSupplier: {
        id: supplier.id,
        nama: supplier.nama,
      },
    });
  } catch (error) {
    console.error("Delete supplier error:", error);
    res.status(500).json({
      message: "Gagal menghapus supplier",
      error: error.message,
    });
  }
};
