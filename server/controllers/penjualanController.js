import {
  Penjualan,
  PenjualanDetail,
  Pelanggan,
  Produk,
} from "../models/index.js";
import { Op } from "sequelize";
import { sequelize } from "../models/index.js";

// GET all penjualan
export const getAllPenjualan = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      tanggal_dari,
      tanggal_sampai,
      pelanggan_id,
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Filter berdasarkan tanggal (pakai createdAt)
    if (tanggal_dari && tanggal_sampai) {
      whereClause.createdAt = {
        [Op.between]: [tanggal_dari, tanggal_sampai],
      };
    } else if (tanggal_dari) {
      whereClause.createdAt = {
        [Op.gte]: tanggal_dari,
      };
    } else if (tanggal_sampai) {
      whereClause.createdAt = {
        [Op.lte]: tanggal_sampai,
      };
    }
    // Filter berdasarkan pelanggan
    if (pelanggan_id) {
      whereClause.PelangganId = pelanggan_id;
    }

    const { count, rows: penjualan } = await Penjualan.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Pelanggan,
          attributes: ["id", "nama", "no_hp"],
        },
        {
          model: PenjualanDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      message: "Data penjualan berhasil diambil",
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      filters: { tanggal_dari, tanggal_sampai, pelanggan_id },
      penjualan,
    });
  } catch (error) {
    console.error("Get all penjualan error:", error);
    res.status(500).json({
      message: "Gagal mengambil data penjualan",
      error: error.message,
    });
  }
};

// GET single penjualan by ID
export const getPenjualanById = async (req, res) => {
  const penjualanId = req.params.id;

  try {
    // Validasi ID
    if (!penjualanId || isNaN(penjualanId)) {
      return res.status(400).json({ message: "ID penjualan tidak valid" });
    }

    const penjualan = await Penjualan.findByPk(penjualanId, {
      include: [
        {
          model: Pelanggan,
          attributes: ["id", "nama", "no_hp", "alamat"],
        },
        {
          model: PenjualanDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama", "harga_jual"],
            },
          ],
        },
      ],
    });

    if (!penjualan) {
      return res.status(404).json({ message: "Penjualan tidak ditemukan" });
    }

    res.json({
      message: "Data penjualan berhasil diambil",
      penjualan,
    });
  } catch (error) {
    console.error("Get penjualan by ID error:", error);
    res.status(500).json({
      message: "Gagal mengambil data penjualan",
      error: error.message,
    });
  }
};

// CREATE new penjualan
export const createPenjualan = async (req, res) => {
  const { pelanggan_id, items } = req.body;
  // items: [{ produk_id, qty }]

  // Start transaction
  const t = await sequelize.transaction();

  try {
    // Validasi input

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({
        message: "Items penjualan harus diisi dan minimal 1 item",
      });
    }

    // Validasi pelanggan jika ada
    let pelanggan = null;
    if (pelanggan_id) {
      pelanggan = await Pelanggan.findByPk(pelanggan_id);
      if (!pelanggan) {
        await t.rollback();
        return res.status(404).json({
          message: "Pelanggan tidak ditemukan",
        });
      }
    }

    // Validasi items dan hitung total
    let total_harga = 0;
    const validatedItems = [];

    for (let item of items) {
      const { produk_id, qty } = item;

      // Cek produk
      const produk = await Produk.findByPk(produk_id);
      if (!produk) {
        await t.rollback();
        return res.status(404).json({
          message: `Produk dengan ID ${produk_id} tidak ditemukan`,
        });
      }

      // Harga satuan otomatis dari produk
      const harga_satuan = parseFloat(produk.harga_jual);

      // Validasi item
      if (
        !produk_id ||
        !qty ||
        qty <= 0 ||
        !harga_satuan ||
        harga_satuan <= 0
      ) {
        await t.rollback();
        return res.status(400).json({
          message:
            "Setiap item harus memiliki produk_id, qty > 0, dan harga_satuan > 0",
        });
      }

      // Cek stok
      if (produk.stok < qty) {
        await t.rollback();
        return res.status(400).json({
          message: `Stok produk ${produk.nama} tidak mencukupi. Stok tersedia: ${produk.stok}, diminta: ${qty}`,
        });
      }

      const subtotal = qty * harga_satuan;
      total_harga += subtotal;

      validatedItems.push({
        produk_id: parseInt(produk_id),
        qty: parseInt(qty),
        harga_satuan,
        subtotal,
        produk,
      });
    }

    // Create penjualan
    const newPenjualan = await Penjualan.create(
      {
        total_harga,
        PelangganId: pelanggan_id || null,
      },
      { transaction: t }
    );

    // Create penjualan details dan update stok
    const penjualanDetails = [];
    for (let item of validatedItems) {
      const detail = await PenjualanDetail.create(
        {
          qty: item.qty,
          harga_satuan: item.harga_satuan,
          PenjualanId: newPenjualan.id,
          ProdukId: item.produk_id,
        },
        { transaction: t }
      );

      // Update stok produk
      await item.produk.update(
        {
          stok: item.produk.stok - item.qty,
        },
        { transaction: t }
      );

      penjualanDetails.push(detail);
    }

    // Commit transaction
    await t.commit();

    // Tambah poin reward ke pelanggan jika ada
    if (pelanggan) {
      // 1 poin per 10.000 total belanja (bisa diubah sesuai kebutuhan)
      const poinBaru = pelanggan.poin + Math.floor(total_harga / 10000);
      await pelanggan.update({ poin: poinBaru });
    }

    // Fetch complete data untuk response
    const completePenjualan = await Penjualan.findByPk(newPenjualan.id, {
      include: [
        {
          model: Pelanggan,
          attributes: ["id", "nama", "no_hp"],
        },
        {
          model: PenjualanDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama"],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      message: "Penjualan berhasil dibuat",
      penjualan: completePenjualan,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Create penjualan error:", error);
    res.status(500).json({
      message: "Gagal membuat penjualan",
      error: error.message,
    });
  }
};

// UPDATE penjualan (hanya tanggal dan pelanggan, tidak mengubah items)
export const updatePenjualan = async (req, res) => {
  const { pelanggan_id } = req.body;
  const penjualanId = req.params.id;

  try {
    // Validasi ID
    if (!penjualanId || isNaN(penjualanId)) {
      return res.status(400).json({ message: "ID penjualan tidak valid" });
    }

    const penjualan = await Penjualan.findByPk(penjualanId);
    if (!penjualan) {
      return res.status(404).json({ message: "Penjualan tidak ditemukan" });
    }

    // Validasi pelanggan jika ada
    if (pelanggan_id) {
      const pelanggan = await Pelanggan.findByPk(pelanggan_id);
      if (!pelanggan) {
        return res.status(404).json({
          message: "Pelanggan tidak ditemukan",
        });
      }
    }

    await penjualan.update({
      PelangganId:
        pelanggan_id !== undefined ? pelanggan_id : penjualan.PelangganId,
    });

    // Fetch complete data untuk response
    const updatedPenjualan = await Penjualan.findByPk(penjualanId, {
      include: [
        {
          model: Pelanggan,
          attributes: ["id", "nama", "no_hp"],
        },
        {
          model: PenjualanDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama"],
            },
          ],
        },
      ],
    });

    res.json({
      message: "Penjualan berhasil diupdate",
      penjualan: updatedPenjualan,
    });
  } catch (error) {
    console.error("Update penjualan error:", error);
    res.status(500).json({
      message: "Gagal update penjualan",
      error: error.message,
    });
  }
};

// DELETE penjualan
export const deletePenjualan = async (req, res) => {
  const penjualanId = req.params.id;

  // Start transaction
  const t = await Sequelize.transaction();

  try {
    // Validasi ID
    if (!penjualanId || isNaN(penjualanId)) {
      await t.rollback();
      return res.status(400).json({ message: "ID penjualan tidak valid" });
    }

    const penjualan = await Penjualan.findByPk(penjualanId, {
      include: [
        {
          model: PenjualanDetail,
          include: [Produk],
        },
      ],
    });

    if (!penjualan) {
      await t.rollback();
      return res.status(404).json({ message: "Penjualan tidak ditemukan" });
    }

    // Kembalikan stok produk
    for (let detail of penjualan.PenjualanDetails) {
      const produk = detail.Produk;
      await produk.update(
        {
          stok: produk.stok + detail.qty,
        },
        { transaction: t }
      );
    }

    // Delete penjualan details
    await PenjualanDetail.destroy(
      {
        where: { PenjualanId: penjualanId },
      },
      { transaction: t }
    );

    // Delete penjualan
    await penjualan.destroy({ transaction: t });

    // Commit transaction
    await t.commit();

    res.json({
      message: "Penjualan berhasil dihapus dan stok produk dikembalikan",
      deletedPenjualan: {
        id: penjualan.id,
        total_harga: penjualan.total_harga,
      },
    });
  } catch (error) {
    await t.rollback();
    console.error("Delete penjualan error:", error);
    res.status(500).json({
      message: "Gagal menghapus penjualan",
      error: error.message,
    });
  }
};

// GET laporan penjualan
export const getLaporanPenjualan = async (req, res) => {
  try {
    const { tanggal_dari, tanggal_sampai, group_by = "day" } = req.query;

    let whereClause = {};

    // Filter berdasarkan tanggal (pakai createdAt)
    if (tanggal_dari && tanggal_sampai) {
      whereClause.createdAt = {
        [Op.between]: [tanggal_dari, tanggal_sampai],
      };
    } else if (tanggal_dari) {
      whereClause.createdAt = {
        [Op.gte]: tanggal_dari,
      };
    } else if (tanggal_sampai) {
      whereClause.createdAt = {
        [Op.lte]: tanggal_sampai,
      };
    }

    // Total penjualan
    const totalPenjualan = await Penjualan.findAll({
      where: whereClause,
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_transaksi"],
        [Sequelize.fn("SUM", Sequelize.col("total_harga")), "total_pendapatan"],
      ],
    });

    // Penjualan per periode
    let groupByFormat;
    switch (group_by) {
      case "month":
        groupByFormat = "%Y-%m";
        break;
      case "year":
        groupByFormat = "%Y";
        break;
      default:
        groupByFormat = "%Y-%m-%d";
    }

    const penjualanPerPeriode = await Penjualan.findAll({
      where: whereClause,
      attributes: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("createdAt"),
            groupByFormat
          ),
          "periode",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_transaksi"],
        [Sequelize.fn("SUM", Sequelize.col("total_harga")), "total_pendapatan"],
      ],
      group: [
        Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), groupByFormat),
      ],
      order: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("createdAt"),
            groupByFormat
          ),
          "DESC",
        ],
      ],
    });

    res.json({
      message: "Laporan penjualan berhasil diambil",
      periode: { tanggal_dari, tanggal_sampai, group_by },
      ringkasan: totalPenjualan[0],
      detail_per_periode: penjualanPerPeriode,
    });
  } catch (error) {
    console.error("Get laporan penjualan error:", error);
    res.status(500).json({
      message: "Gagal mengambil laporan penjualan",
      error: error.message,
    });
  }
};
