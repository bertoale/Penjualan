# Penjualan App

Aplikasi manajemen penjualan berbasis web menggunakan Vue 3 (Vite) untuk frontend dan Node.js (Express + Sequelize) untuk backend.

## Fitur

- Manajemen Produk, Kategori, Supplier, Pelanggan
- Transaksi Penjualan & Pembelian
- Laporan
- Autentikasi User
- Export data ke Excel
- Notifikasi Toast

## Struktur Folder

```
client/      # Frontend Vue 3
server/      # Backend Express & Sequelize
```

## Instalasi

### 1. Clone Repository

```bash
git clone <repo-url>
cd Penjualan
```

### 2. Setup Backend

```bash
cd server
npm install
```

- Edit file `.env` sesuai konfigurasi database MySQL Anda.
- Jalankan server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend berjalan di: `http://localhost:5173`  
Backend berjalan di: `http://localhost:3000`

## Konfigurasi Database

- Pastikan MySQL sudah berjalan.
- Buat database sesuai `.env` (default: `penjualan`).
- Contoh isi `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=penjualan
DB_DIALECT=mysql
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_2024_penjualan_app
CORS_ORIGIN=http://localhost:5173
```

## Penggunaan

- Login sebagai admin/kasir/owner.
- Tambah/edit/hapus produk, kategori, supplier, pelanggan.
- Lakukan transaksi penjualan dan pembelian.
- Lihat laporan dan export data.

## Pengembangan

- Frontend: Vue 3, TailwindCSS, Axios, Vite
- Backend: Express, Sequelize, MySQL2

## Skrip Penting

### Frontend

- `npm run dev` — Jalankan development server
- `npm run build` — Build production
- `npm run preview` — Preview build

### Backend

- `npm run dev` — Jalankan server dengan nodemon

## Lisensi

MIT
