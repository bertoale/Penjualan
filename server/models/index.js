import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
// Import model definitions
import UserModel from "./user.js";
import PelangganModel from "./pelanggan.js";
import SupplierModel from "./supplier.js";
import ProdukModel from "./produk.js";
import ProdukKategoriModel from "./produkKategori.js";
import PenjualanModel from "./penjualan.js";
import PenjualanDetailModel from "./penjualanDetail.js";
import PembelianModel from "./pembelian.js";
import PembelianDetailModel from "./pembelianDetail.js";

// Gunakan ENV
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false, // disable logging SQL jika ingin bersih
    timezone: "+08:00", // ⬅️ ini untuk WITA (UTC+8)
  }
);

// Inisialisasi semua model
const User = UserModel(sequelize, Sequelize.DataTypes);
const Pelanggan = PelangganModel(sequelize, Sequelize.DataTypes);
const Supplier = SupplierModel(sequelize, Sequelize.DataTypes);
const Produk = ProdukModel(sequelize, Sequelize.DataTypes);
const ProdukKategori = ProdukKategoriModel(sequelize, Sequelize.DataTypes);
const Penjualan = PenjualanModel(sequelize, Sequelize.DataTypes);
const PenjualanDetail = PenjualanDetailModel(sequelize, Sequelize.DataTypes);
const Pembelian = PembelianModel(sequelize, Sequelize.DataTypes);
const PembelianDetail = PembelianDetailModel(sequelize, Sequelize.DataTypes);

// RELASI PENJUALAN
Penjualan.belongsTo(Pelanggan);
Pelanggan.hasMany(Penjualan);

PenjualanDetail.belongsTo(Penjualan);
Penjualan.hasMany(PenjualanDetail);

PenjualanDetail.belongsTo(Produk);
Produk.hasMany(PenjualanDetail);

// RELASI PEMBELIAN
Pembelian.belongsTo(Supplier);
Supplier.hasMany(Pembelian);

PembelianDetail.belongsTo(Pembelian);
Pembelian.hasMany(PembelianDetail);

PembelianDetail.belongsTo(Produk);
Produk.hasMany(PembelianDetail);

// RELASI PRODUK
Produk.belongsTo(ProdukKategori);
ProdukKategori.hasMany(Produk);
// Export semua dalam satu objek
export {
  sequelize,
  Sequelize,
  User,
  Pelanggan,
  Supplier,
  Produk,
  ProdukKategori,
  Penjualan,
  PenjualanDetail,
  Pembelian,
  PembelianDetail,
};
