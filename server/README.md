# Sistem Penjualan API

Sistem API untuk manajemen penjualan yang lengkap dengan fitur autentikasi, manajemen user, pelanggan, supplier, produk, penjualan, dan pembelian.

## 🚀 Fitur Utama

### Autentikasi & Authorization

- ✅ Register & Login dengan JWT
- ✅ Role-based access control (Admin, Kasir, Owner)
- ✅ Protected routes dengan middleware autentikasi
- ✅ User profile management

### Manajemen Data

- ✅ **User Management**: CRUD operations dengan role system
- ✅ **Pelanggan Management**: Kelola data pelanggan
- ✅ **Supplier Management**: Kelola data supplier
- ✅ **Produk Management**: Kelola stok dan harga produk
- ✅ **Penjualan Management**: Transaksi penjualan dengan detail
- ✅ **Pembelian Management**: Transaksi pembelian dari supplier

### Fitur Advanced

- ✅ Pagination untuk semua list data
- ✅ Search & filtering
- ✅ Input validation & error handling
- ✅ Database relationships (One-to-Many, Many-to-Many)
- ✅ CORS support
- ✅ Environment configuration

## 🛠 Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: JWT (JSON Web Token)
- **Security**: bcrypt untuk password hashing
- **Development**: nodemon untuk hot reload

## 📁 Struktur Proyek

```
server/
├── controllers/          # Business logic untuk setiap endpoint
│   ├── userController.js
│   ├── pelangganController.js
│   ├── supplierController.js
│   ├── produkController.js
│   ├── penjualanController.js
│   └── pembelianController.js
├── middleware/           # Custom middleware
│   └── auth.js          # JWT authentication & authorization
├── models/              # Database models dengan Sequelize
│   ├── index.js         # Database connection & associations
│   ├── user.js
│   ├── pelanggan.js
│   ├── supplier.js
│   ├── produk.js
│   ├── penjualan.js
│   ├── penjualanDetail.js
│   ├── pembelian.js
│   └── pembelianDetail.js
├── routes/              # API route definitions
│   ├── userRoutes.js
│   ├── pelangganRoutes.js
│   ├── supplierRoutes.js
│   ├── produkRoutes.js
│   ├── penjualanRoutes.js
│   └── pembelianRoutes.js
├── .env                 # Environment variables
├── app.js              # Express app configuration
├── package.json        # Dependencies & scripts
└── API_TESTING.md      # API documentation & testing guide
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js (v14 atau lebih baru)
- MySQL Server
- npm atau yarn

### Installation Steps

1. **Clone & Install Dependencies**

```bash
cd server
npm install
```

2. **Database Setup**

```bash
# Buat database MySQL baru
CREATE DATABASE penjualan;
```

3. **Environment Configuration**

```bash
# Copy dan edit file .env
cp .env.example .env
```

Edit file `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=penjualan
DB_DIALECT=mysql
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
```

4. **Start Development Server**

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

## 📚 API Documentation

Lihat file [API_TESTING.md](./API_TESTING.md) untuk dokumentasi lengkap semua endpoint, contoh request/response, dan panduan testing.

### Quick Start - Test API

1. **Register User**

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123","role":"admin"}'
```

2. **Login**

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

3. **Use JWT Token**

```bash
# Simpan token dari response login, lalu gunakan:
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔐 Role System

### Admin

- Full access ke semua endpoint
- Dapat mengelola users, menghapus data

### Owner

- Access ke semua data operasional
- Tidak dapat mengelola users

### Kasir

- Access terbatas untuk operasional harian
- Dapat mengelola pelanggan, produk, penjualan
- Tidak dapat menghapus data penting

## 🗄 Database Schema

### Core Tables

- `User` - Manajemen pengguna sistem
- `Pelanggan` - Data pelanggan
- `Supplier` - Data supplier
- `Produk` - Master data produk

### Transaction Tables

- `Penjualan` - Header transaksi penjualan
- `PenjualanDetail` - Detail item yang dijual
- `Pembelian` - Header transaksi pembelian
- `PembelianDetail` - Detail item yang dibeli

### Relationships

```
Pelanggan → Penjualan (One-to-Many)
Supplier → Pembelian (One-to-Many)
Penjualan → PenjualanDetail (One-to-Many)
Pembelian → PembelianDetail (One-to-Many)
Produk → PenjualanDetail (One-to-Many)
Produk → PembelianDetail (One-to-Many)
```

## 🧪 Testing

### Manual Testing

Gunakan tools seperti:

- cURL (command line)
- Postman
- Insomnia
- VS Code REST Client

### Test Scenarios

1. Authentication flow (register, login, protected routes)
2. CRUD operations untuk setiap entity
3. Search & pagination
4. Role-based access control
5. Error handling & validation

## 🚦 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 🔄 Development Workflow

1. **Code Structure**: Gunakan MVC pattern
2. **Error Handling**: Consistent error responses
3. **Validation**: Input validation di controller
4. **Security**: JWT tokens, password hashing
5. **Documentation**: Update API docs untuk perubahan

## 📝 TODO / Future Enhancements

- [ ] Add unit tests
- [ ] Add logging system
- [ ] Implement refresh tokens
- [ ] Add email notifications
- [ ] Dashboard & analytics endpoints
- [ ] File upload for product images
- [ ] Export data to Excel/PDF
- [ ] Real-time notifications with WebSocket

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Jika mengalami masalah atau butuh bantuan:

1. Periksa file [API_TESTING.md](./API_TESTING.md)
2. Cek console output untuk error messages
3. Pastikan database connection berhasil
4. Verifikasi environment variables di `.env`
