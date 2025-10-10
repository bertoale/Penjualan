import {
  Pembelian,
  PembelianDetail,
  Supplier,
  Produk,
  ProdukKategori,
  sequelize, // tambahkan ini
  Sequelize, // tambahkan ini
} from "../models/index.js";
import { Op } from "sequelize";

// GET all pembelian
export const getAllPembelian = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      tanggal_dari,
      tanggal_sampai,
      supplier_id,
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Filter berdasarkan tanggal
    if (tanggal_dari && tanggal_sampai) {
      whereClause.tanggal = {
        [Op.between]: [tanggal_dari, tanggal_sampai],
      };
    } else if (tanggal_dari) {
      whereClause.tanggal = {
        [Op.gte]: tanggal_dari,
      };
    } else if (tanggal_sampai) {
      whereClause.tanggal = {
        [Op.lte]: tanggal_sampai,
      };
    }

    // Filter berdasarkan supplier
    if (supplier_id) {
      whereClause.SupplierId = supplier_id;
    }
    const pembelian = await Pembelian.findAll({
      where: whereClause,
      include: [
        {
          model: Supplier,
          attributes: ["id", "nama", "no_hp"],
        },
        {
          model: PembelianDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama"],
              include: [
                {
                  model: ProdukKategori,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["tanggal", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json({
      message: "Data pembelian berhasil diambil",
      count: pembelian.length,
      filters: { tanggal_dari, tanggal_sampai, supplier_id },
      pembelian,
    });
  } catch (error) {
    console.error("Get all pembelian error:", error);
    res.status(500).json({
      message: "Gagal mengambil data pembelian",
      error: error.message,
    });
  }
};

// GET single pembelian by ID
export const getPembelianById = async (req, res) => {
  const pembelianId = req.params.id;

  try {
    // Validasi ID
    if (!pembelianId || isNaN(pembelianId)) {
      return res.status(400).json({ message: "ID pembelian tidak valid" });
    }

    const pembelian = await Pembelian.findByPk(pembelianId, {
      include: [
        {
          model: Supplier,
          attributes: ["id", "nama", "no_hp", "alamat"],
        },
        {
          model: PembelianDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama", "harga_beli"],
              include: [
                {
                  model: ProdukKategori,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!pembelian) {
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }

    res.json({
      message: "Data pembelian berhasil diambil",
      pembelian,
    });
  } catch (error) {
    console.error("Get pembelian by ID error:", error);
    res.status(500).json({
      message: "Gagal mengambil data pembelian",
      error: error.message,
    });
  }
};

// CREATE new pembelian
export const createPembelian = async (req, res) => {
  const { tanggal, supplier_id } = req.body;
  let { items } = req.body;
  // items: [{ produk_id, qty, harga_satuan }]

  // Robust parsing for items (support JSON, x-www-form-urlencoded, stringified array)
  if (typeof items === "string") {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(items);
      if (Array.isArray(parsed)) {
        items = parsed;
      } else {
        // Fallback: try comma-separated ids (not recommended, but for safety)
        items = items.split(",").map((id) => ({ produk_id: id }));
      }
    } catch (e) {
      // Fallback: try comma-separated ids (not recommended, but for safety)
      if (items.includes("{")) {
        // Looks like a broken JSON, try to fix
        try {
          items = eval(items); // last resort, not recommended for prod
        } catch (e2) {
          items = [];
        }
      } else {
        items = items.split(",").map((id) => ({ produk_id: id }));
      }
    }
  }

  // Start transaction
  const t = await sequelize.transaction(); // ganti Sequelize.transaction() menjadi sequelize.transaction()

  try {
    // Validasi input
    if (!tanggal) {
      await t.rollback();
      return res.status(400).json({
        message: "Tanggal pembelian harus diisi",
      });
    }

    if (!supplier_id) {
      await t.rollback();
      return res.status(400).json({
        message: "Supplier harus dipilih",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({
        message: "Items pembelian harus diisi dan minimal 1 item",
      });
    }

    // Validasi supplier
    const supplier = await Supplier.findByPk(supplier_id);
    if (!supplier) {
      await t.rollback();
      return res.status(404).json({
        message: "Supplier tidak ditemukan",
      });
    }

    // Validasi items dan hitung total
    let total_harga = 0;
    const validatedItems = [];

    for (let item of items) {
      let { produk_id, qty, harga_satuan } = item;

      // Robust parsing produk_id
      if (typeof produk_id === "string" && produk_id.includes(",")) {
        await t.rollback();
        return res.status(400).json({
          message:
            "produk_id pada setiap item harus satu ID saja, bukan array/string koma. Kirim satu produk_id per item.",
          produk_id,
        });
      }
      // Convert produk_id to number
      produk_id = parseInt(produk_id);
      qty = parseInt(qty);
      harga_satuan = parseFloat(harga_satuan);

      // Validasi item
      if (
        !produk_id ||
        isNaN(produk_id) ||
        !qty ||
        qty <= 0 ||
        !harga_satuan ||
        harga_satuan <= 0
      ) {
        await t.rollback();
        return res.status(400).json({
          message:
            "Setiap item harus memiliki produk_id (number), qty > 0, dan harga_satuan > 0",
          item,
        });
      }

      // Cek produk
      const produk = await Produk.findByPk(produk_id);
      if (!produk) {
        await t.rollback();
        return res.status(404).json({
          message: `Produk dengan ID ${produk_id} tidak ditemukan`,
        });
      }

      const subtotal = qty * harga_satuan;
      total_harga += subtotal;

      validatedItems.push({
        produk_id,
        qty,
        harga_satuan,
        subtotal,
        produk,
      });
    }

    // Create pembelian
    const newPembelian = await Pembelian.create(
      {
        tanggal,
        total_harga,
        SupplierId: supplier_id,
      },
      { transaction: t }
    );

    // Create pembelian details dan update stok
    const pembelianDetails = [];
    for (let item of validatedItems) {
      const detail = await PembelianDetail.create(
        {
          qty: item.qty,
          harga_satuan: item.harga_satuan,
          PembelianId: newPembelian.id,
          ProdukId: item.produk_id,
        },
        { transaction: t }
      );

      // Update stok produk (tambah stok) dan harga beli jika berbeda
      await item.produk.update(
        {
          stok: item.produk.stok + item.qty,
          harga_beli: item.harga_satuan, // Update harga beli ke harga terbaru
        },
        { transaction: t }
      );

      pembelianDetails.push(detail);
    }

    // Commit transaction
    await t.commit(); // Fetch complete data untuk response
    const completePembelian = await Pembelian.findByPk(newPembelian.id, {
      include: [
        {
          model: Supplier,
          attributes: ["id", "nama", "no_hp"],
        },
        {
          model: PembelianDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama"],
              include: [
                {
                  model: ProdukKategori,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      message: "Pembelian berhasil dibuat",
      pembelian: completePembelian,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Create pembelian error:", error);
    res.status(500).json({
      message: "Gagal membuat pembelian",
      error: error.message,
    });
  }
};

// UPDATE pembelian (hanya tanggal dan supplier, tidak mengubah items)
export const updatePembelian = async (req, res) => {
  const { tanggal, supplier_id } = req.body;
  const pembelianId = req.params.id;

  try {
    // Validasi ID
    if (!pembelianId || isNaN(pembelianId)) {
      return res.status(400).json({ message: "ID pembelian tidak valid" });
    }

    const pembelian = await Pembelian.findByPk(pembelianId);
    if (!pembelian) {
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }

    // Validasi supplier jika ada
    if (supplier_id) {
      const supplier = await Supplier.findByPk(supplier_id);
      if (!supplier) {
        return res.status(404).json({
          message: "Supplier tidak ditemukan",
        });
      }
    }

    await pembelian.update({
      tanggal: tanggal || pembelian.tanggal,
      SupplierId: supplier_id || pembelian.SupplierId,
    }); // Fetch complete data untuk response
    const updatedPembelian = await Pembelian.findByPk(pembelianId, {
      include: [
        {
          model: Supplier,
          attributes: ["id", "nama", "no_hp"],
        },
        {
          model: PembelianDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama"],
              include: [
                {
                  model: ProdukKategori,
                  attributes: ["id", "nama"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.json({
      message: "Pembelian berhasil diupdate",
      pembelian: updatedPembelian,
    });
  } catch (error) {
    console.error("Update pembelian error:", error);
    res.status(500).json({
      message: "Gagal update pembelian",
      error: error.message,
    });
  }
};

// DELETE pembelian
export const deletePembelian = async (req, res) => {
  const pembelianId = req.params.id;

  // Start transaction
  const t = await sequelize.transaction(); // ganti Sequelize.transaction() menjadi sequelize.transaction()

  try {
    // Validasi ID
    if (!pembelianId || isNaN(pembelianId)) {
      await t.rollback();
      return res.status(400).json({ message: "ID pembelian tidak valid" });
    }

    const pembelian = await Pembelian.findByPk(pembelianId, {
      include: [
        {
          model: PembelianDetail,
          include: [Produk],
        },
      ],
    });

    if (!pembelian) {
      await t.rollback();
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }

    // Kurangi stok produk (kembalikan seperti sebelum pembelian)
    for (let detail of pembelian.PembelianDetails) {
      const produk = detail.Produk;
      const newStok = produk.stok - detail.qty;

      if (newStok < 0) {
        await t.rollback();
        return res.status(400).json({
          message: `Tidak dapat menghapus pembelian. Stok produk ${produk.nama} akan menjadi negatif (${newStok})`,
        });
      }

      await produk.update(
        {
          stok: newStok,
        },
        { transaction: t }
      );
    }

    // Delete pembelian details
    await PembelianDetail.destroy(
      {
        where: { PembelianId: pembelianId },
      },
      { transaction: t }
    );

    // Delete pembelian
    await pembelian.destroy({ transaction: t });

    // Commit transaction
    await t.commit();

    res.json({
      message: "Pembelian berhasil dihapus dan stok produk disesuaikan",
      deletedPembelian: {
        id: pembelian.id,
        tanggal: pembelian.tanggal,
        total_harga: pembelian.total_harga,
      },
    });
  } catch (error) {
    await t.rollback();
    console.error("Delete pembelian error:", error);
    res.status(500).json({
      message: "Gagal menghapus pembelian",
      error: error.message,
    });
  }
};

// GET laporan pembelian
export const getLaporanPembelian = async (req, res) => {
  try {
    const { tanggal_dari, tanggal_sampai, group_by = "day" } = req.query;

    let whereClause = {};

    // Filter berdasarkan tanggal
    if (tanggal_dari && tanggal_sampai) {
      whereClause.tanggal = {
        [Op.between]: [tanggal_dari, tanggal_sampai],
      };
    } else if (tanggal_dari) {
      whereClause.tanggal = {
        [Op.gte]: tanggal_dari,
      };
    } else if (tanggal_sampai) {
      whereClause.tanggal = {
        [Op.lte]: tanggal_sampai,
      };
    }

    // Total pembelian
    const totalPembelian = await Pembelian.findAll({
      where: whereClause,
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_transaksi"],
        [
          Sequelize.fn("SUM", Sequelize.col("total_harga")),
          "total_pengeluaran",
        ],
      ],
    });

    // Pembelian per periode
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

    const pembelianPerPeriode = await Pembelian.findAll({
      where: whereClause,
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), groupByFormat),
          "periode",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_transaksi"],
        [
          Sequelize.fn("SUM", Sequelize.col("total_harga")),
          "total_pengeluaran",
        ],
      ],
      group: [
        Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), groupByFormat),
      ],
      order: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), groupByFormat),
          "DESC",
        ],
      ],
    });

    res.json({
      message: "Laporan pembelian berhasil diambil",
      periode: { tanggal_dari, tanggal_sampai, group_by },
      ringkasan: totalPembelian[0],
      detail_per_periode: pembelianPerPeriode,
    });
  } catch (error) {
    console.error("Get laporan pembelian error:", error);
    res.status(500).json({
      message: "Gagal mengambil laporan pembelian",
      error: error.message,
    });
  }
};
