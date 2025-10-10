import { Produk, ProdukKategori } from "../models/index.js";
import { Op } from "sequelize";

// GET all produk
export const getAllProduk = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      kategori_id,
      stok_minimum,
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { "$ProdukKategori.nama$": { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter berdasarkan kategori jika ada
    if (kategori_id) {
      whereClause.ProdukKategoriId = kategori_id;
    }

    // Filter produk dengan stok minimum jika ada
    if (stok_minimum) {
      whereClause.stok = {
        [Op.lte]: parseInt(stok_minimum),
      };
    }

    const { count, rows: produk } = await Produk.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
      order: [
        [{ model: ProdukKategori }, "nama", "ASC"], // kategori ASC
        ["nama", "ASC"], // lalu produk ASC
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      message: "Data produk berhasil diambil",
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      filters: { kategori_id, stok_minimum, search },
      produk,
    });
  } catch (error) {
    console.error("Get all produk error:", error);
    res.status(500).json({
      message: "Gagal mengambil data produk",
      error: error.message,
    });
  }
};

// GET single produk by ID
export const getProdukById = async (req, res) => {
  const produkId = req.params.id;

  try {
    // Validasi ID
    if (!produkId || isNaN(produkId)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    const produk = await Produk.findByPk(produkId, {
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
    });

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({
      message: "Data produk berhasil diambil",
      produk,
    });
  } catch (error) {
    console.error("Get produk by ID error:", error);
    res.status(500).json({
      message: "Gagal mengambil data produk",
      error: error.message,
    });
  }
};

// CREATE new produk
export const createProduk = async (req, res) => {
  const { nama, kategori_id, harga_beli, harga_jual, stok } = req.body;

  try {
    // Validasi input
    if (!nama || nama.trim().length === 0) {
      return res.status(400).json({
        message: "Nama produk harus diisi",
      });
    }

    if (!harga_beli || harga_beli <= 0) {
      return res.status(400).json({
        message: "Harga beli harus diisi dan lebih dari 0",
      });
    }

    if (!harga_jual || harga_jual <= 0) {
      return res.status(400).json({
        message: "Harga jual harus diisi dan lebih dari 0",
      });
    }

    if (harga_jual <= harga_beli) {
      return res.status(400).json({
        message: "Harga jual harus lebih besar dari harga beli",
      });
    }

    if (stok === undefined || stok < 0) {
      return res.status(400).json({
        message: "Stok harus diisi dan tidak boleh negatif",
      });
    }

    // Validasi kategori jika ada
    if (kategori_id) {
      const kategori = await ProdukKategori.findByPk(kategori_id);
      if (!kategori) {
        return res.status(404).json({
          message: "Kategori tidak ditemukan",
        });
      }
    }

    // Cek apakah produk dengan nama yang sama sudah ada
    const existingProduk = await Produk.findOne({
      where: { nama: nama.trim() },
    });
    if (existingProduk) {
      return res.status(409).json({
        message: "Produk dengan nama tersebut sudah ada",
      });
    }

    const newProduk = await Produk.create({
      nama: nama.trim(),
      ProdukKategoriId: kategori_id || null,
      harga_beli: parseFloat(harga_beli),
      harga_jual: parseFloat(harga_jual),
      stok: parseInt(stok),
    });

    // Ambil data produk yang baru dibuat beserta kategorinya
    const produkWithKategori = await Produk.findByPk(newProduk.id, {
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
    });

    res.status(201).json({
      message: "Produk berhasil dibuat",
      produk: produkWithKategori,
    });
  } catch (error) {
    console.error("Create produk error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Gagal membuat produk",
      error: error.message,
    });
  }
};

// UPDATE produk
export const updateProduk = async (req, res) => {
  const { nama, kategori_id, harga_beli, harga_jual, stok } = req.body;
  const produkId = req.params.id;

  try {
    // Validasi ID
    if (!produkId || isNaN(produkId)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    const produk = await Produk.findByPk(produkId);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Validasi input jika ada perubahan
    if (nama && nama.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Nama produk tidak boleh kosong" });
    }

    if (harga_beli !== undefined && harga_beli <= 0) {
      return res.status(400).json({ message: "Harga beli harus lebih dari 0" });
    }

    if (harga_jual !== undefined && harga_jual <= 0) {
      return res.status(400).json({ message: "Harga jual harus lebih dari 0" });
    }

    const newHargaBeli =
      harga_beli !== undefined ? parseFloat(harga_beli) : produk.harga_beli;
    const newHargaJual =
      harga_jual !== undefined ? parseFloat(harga_jual) : produk.harga_jual;

    if (newHargaJual <= newHargaBeli) {
      return res.status(400).json({
        message: "Harga jual harus lebih besar dari harga beli",
      });
    }

    if (stok !== undefined && stok < 0) {
      return res.status(400).json({ message: "Stok tidak boleh negatif" });
    }

    // Validasi kategori jika ada perubahan
    if (kategori_id !== undefined && kategori_id !== null) {
      const kategori = await ProdukKategori.findByPk(kategori_id);
      if (!kategori) {
        return res.status(404).json({
          message: "Kategori tidak ditemukan",
        });
      }
    }

    // Cek apakah nama baru sudah digunakan produk lain
    if (nama && nama.trim() !== produk.nama) {
      const existingProduk = await Produk.findOne({
        where: { nama: nama.trim() },
        attributes: ["id"],
      });
      if (existingProduk && existingProduk.id !== parseInt(produkId)) {
        return res.status(409).json({
          message: "Nama produk sudah digunakan oleh produk lain",
        });
      }
    }

    await produk.update({
      nama: nama?.trim() || produk.nama,
      ProdukKategoriId:
        kategori_id !== undefined ? kategori_id : produk.ProdukKategoriId,
      harga_beli: newHargaBeli,
      harga_jual: newHargaJual,
      stok: stok !== undefined ? parseInt(stok) : produk.stok,
    });

    // Ambil data produk yang sudah diupdate beserta kategorinya
    const updatedProduk = await Produk.findByPk(produkId, {
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
    });

    res.json({
      message: "Produk berhasil diupdate",
      produk: updatedProduk,
    });
  } catch (error) {
    console.error("Update produk error:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Gagal update produk",
      error: error.message,
    });
  }
};

// UPDATE stok produk (untuk transaksi)
export const updateStokProduk = async (req, res) => {
  const { stok_perubahan, tipe } = req.body; // tipe: 'tambah' atau 'kurang'
  const produkId = req.params.id;

  try {
    // Validasi ID
    if (!produkId || isNaN(produkId)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    // Validasi input
    if (!stok_perubahan || stok_perubahan <= 0) {
      return res
        .status(400)
        .json({ message: "Jumlah perubahan stok harus lebih dari 0" });
    }

    if (!tipe || !["tambah", "kurang"].includes(tipe)) {
      return res
        .status(400)
        .json({ message: "Tipe harus 'tambah' atau 'kurang'" });
    }

    const produk = await Produk.findByPk(produkId, {
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
    });
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    let newStok;
    if (tipe === "tambah") {
      newStok = produk.stok + parseInt(stok_perubahan);
    } else {
      newStok = produk.stok - parseInt(stok_perubahan);
      if (newStok < 0) {
        return res.status(400).json({
          message: `Stok tidak mencukupi. Stok saat ini: ${produk.stok}, diminta: ${stok_perubahan}`,
        });
      }
    }

    await produk.update({ stok: newStok });

    res.json({
      message: `Stok produk berhasil ${
        tipe === "tambah" ? "ditambah" : "dikurang"
      }`,
      produk: {
        id: produk.id,
        nama: produk.nama,
        kategori: produk.ProdukKategori?.nama || null,
        stok_lama: produk.stok,
        stok_baru: newStok,
        perubahan: `${tipe === "tambah" ? "+" : "-"}${stok_perubahan}`,
      },
    });
  } catch (error) {
    console.error("Update stok produk error:", error);
    res.status(500).json({
      message: "Gagal update stok produk",
      error: error.message,
    });
  }
};

// DELETE produk
export const deleteProduk = async (req, res) => {
  const produkId = req.params.id;

  try {
    // Validasi ID
    if (!produkId || isNaN(produkId)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    const produk = await Produk.findByPk(produkId, {
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
    });
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // TODO: Cek apakah produk memiliki transaksi penjualan/pembelian
    // Jika ada, mungkin tidak boleh dihapus atau kasih warning

    await produk.destroy();
    res.json({
      message: "Produk berhasil dihapus",
      deletedProduk: {
        id: produk.id,
        nama: produk.nama,
        kategori: produk.ProdukKategori?.nama || null,
      },
    });
  } catch (error) {
    console.error("Delete produk error:", error);
    res.status(500).json({
      message: "Gagal menghapus produk",
      error: error.message,
    });
  }
};

// GET produk dengan stok rendah
export const getProdukStokRendah = async (req, res) => {
  try {
    const { batas = 10 } = req.query;

    const produkStokRendah = await Produk.findAll({
      where: {
        stok: {
          [Op.lte]: parseInt(batas),
        },
      },
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
      order: [["stok", "ASC"]],
    });

    res.json({
      message: `Produk dengan stok <= ${batas}`,
      count: produkStokRendah.length,
      batas_stok: parseInt(batas),
      produk: produkStokRendah,
    });
  } catch (error) {
    console.error("Get produk stok rendah error:", error);
    res.status(500).json({
      message: "Gagal mengambil data produk stok rendah",
      error: error.message,
    });
  }
};

// GET produk berdasarkan kategori
export const getProdukByKategori = async (req, res) => {
  const kategoriId = req.params.kategoriId;

  try {
    // Validasi ID kategori
    if (!kategoriId || isNaN(kategoriId)) {
      return res.status(400).json({ message: "ID kategori tidak valid" });
    }

    // Cek apakah kategori ada
    const kategori = await ProdukKategori.findByPk(kategoriId);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    const produk = await Produk.findAll({
      where: { ProdukKategoriId: kategoriId },
      include: [
        {
          model: ProdukKategori,
          attributes: ["id", "nama"],
        },
      ],
      order: [["nama", "ASC"]],
    });

    res.json({
      message: `Produk dalam kategori: ${kategori.nama}`,
      kategori: {
        id: kategori.id,
        nama: kategori.nama,
      },
      count: produk.length,
      produk,
    });
  } catch (error) {
    console.error("Get produk by kategori error:", error);
    res.status(500).json({
      message: "Gagal mengambil data produk berdasarkan kategori",
      error: error.message,
    });
  }
};
