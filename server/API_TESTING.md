# API Testing Guide - Sistem Penjualan

Berikut adalah panduan lengkap untuk menguji semua API endpoint sistem penjualan.

## Base URL

```
http://localhost:3000
```

## Authentication

Sistem menggunakan JWT (JSON Web Token) untuk autentikasi. Setelah login, simpan token yang diterima dan gunakan pada header `Authorization: Bearer <token>` untuk endpoint yang memerlukan autentikasi.

## User Management Endpoints

### 1. Register User (Public)

**POST** `/api/users/register`

```json
{
  "username": "testuser",
  "password": "password123",
  "role": "kasir"
}
```

### 2. Login User (Public)

**POST** `/api/users/login`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

### 3. Get User Profile (Authenticated)

**GET** `/api/users/profile`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 4. Update User Profile (Authenticated)

**PUT** `/api/users/profile`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "username": "newusername",
  "password": "newpassword123"
}
```

### 5. Get All Users (Admin/Owner only)

**GET** `/api/users`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 6. Get User by ID (Admin atau user sendiri)

**GET** `/api/users/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 7. Update User (Admin atau user sendiri)

**PUT** `/api/users/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "username": "newusername",
  "password": "newpassword123",
  "role": "admin"
}
```

### 8. Delete User (Admin only)

**DELETE** `/api/users/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 9. Logout (Authenticated)

**POST** `/api/users/logout`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

## Pelanggan Management Endpoints

### 1. Get All Pelanggan (Authenticated)

**GET** `/api/pelanggan?page=1&limit=10&search=john`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 2. Get Pelanggan by ID (Authenticated)

**GET** `/api/pelanggan/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 3. Create Pelanggan (Authenticated)

**POST** `/api/pelanggan`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "nama": "John Doe",
  "no_hp": "08123456789",
  "alamat": "Jl. Merdeka No. 123"
}
```

### 4. Update Pelanggan (Authenticated)

**PUT** `/api/pelanggan/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "nama": "John Doe Updated",
  "no_hp": "08123456789",
  "alamat": "Jl. Merdeka No. 456"
}
```

### 5. Delete Pelanggan (Admin/Owner only)

**DELETE** `/api/pelanggan/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

## Supplier Management Endpoints

### 1. Get All Supplier (Authenticated)

**GET** `/api/supplier?page=1&limit=10&search=supplier`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 2. Get Supplier by ID (Authenticated)

**GET** `/api/supplier/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 3. Create Supplier (Authenticated)

**POST** `/api/supplier`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "nama": "PT. Supplier ABC",
  "no_hp": "021-123456",
  "alamat": "Jl. Industri No. 1"
}
```

### 4. Update Supplier (Authenticated)

**PUT** `/api/supplier/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "nama": "PT. Supplier ABC Updated",
  "no_hp": "021-123456",
  "alamat": "Jl. Industri No. 2"
}
```

### 5. Delete Supplier (Admin/Owner only)

**DELETE** `/api/supplier/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

## Produk Management Endpoints

### 1. Get All Produk (Authenticated)

**GET** `/api/produk?page=1&limit=10&search=laptop&kategori=elektronik&stok_minimum=5`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 2. Get Produk by ID (Authenticated)

**GET** `/api/produk/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 3. Create Produk (Authenticated)

**POST** `/api/produk`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "nama": "Laptop ASUS",
  "kategori": "Elektronik",
  "harga_beli": 5000000,
  "harga_jual": 7000000,
  "stok": 10
}
```

### 4. Update Produk (Authenticated)

**PUT** `/api/produk/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "nama": "Laptop ASUS ROG",
  "kategori": "Elektronik",
  "harga_beli": 6000000,
  "harga_jual": 8000000,
  "stok": 15
}
```

### 5. Delete Produk (Admin/Owner only)

**DELETE** `/api/produk/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

## Penjualan Management Endpoints

### 1. Get All Penjualan (Authenticated)

**GET** `/api/penjualan?page=1&limit=10&tanggal_dari=2024-01-01&tanggal_sampai=2024-12-31&pelanggan_id=1`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 2. Get Penjualan by ID (Authenticated)

**GET** `/api/penjualan/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 3. Create Penjualan (Authenticated)

**POST** `/api/penjualan`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "tanggal": "2024-01-15",
  "pelanggan_id": 1,
  "items": [
    {
      "produk_id": 1,
      "qty": 2,
      "harga_satuan": 7000000
    },
    {
      "produk_id": 2,
      "qty": 1,
      "harga_satuan": 1500000
    }
  ]
}
```

### 4. Update Penjualan (Authenticated)

**PUT** `/api/penjualan/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 5. Delete Penjualan (Admin/Owner only)

**DELETE** `/api/penjualan/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

## Pembelian Management Endpoints

### 1. Get All Pembelian (Authenticated)

**GET** `/api/pembelian?page=1&limit=10&tanggal_dari=2024-01-01&tanggal_sampai=2024-12-31&supplier_id=1`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 2. Get Pembelian by ID (Authenticated)

**GET** `/api/pembelian/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 3. Create Pembelian (Authenticated)

**POST** `/api/pembelian`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

Body:

```json
{
  "tanggal": "2024-01-10",
  "supplier_id": 1,
  "items": [
    {
      "produk_id": 1,
      "qty": 5,
      "harga_satuan": 5000000
    }
  ]
}
```

### 4. Update Pembelian (Authenticated)

**PUT** `/api/pembelian/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

### 5. Delete Pembelian (Admin/Owner only)

**DELETE** `/api/pembelian/:id`
Headers:

```
Authorization: Bearer <your_jwt_token>
```

## Authorization Levels:

- **Public**: Semua bisa akses
- **Authenticated**: User yang sudah login
- **Admin**: Hanya user dengan role admin
- **Owner**: Hanya user dengan role owner
- **Admin/Owner**: Admin atau owner
- **User/Admin**: User sendiri atau admin

## Valid Roles:

- `admin` - Administrator sistem
- `kasir` - Kasir/Staff penjualan
- `owner` - Pemilik toko

## Query Parameters:

- `page`: Halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10)
- `search`: Pencarian berdasarkan nama
- `kategori`: Filter berdasarkan kategori (untuk produk)
- `stok_minimum`: Filter produk dengan stok <= nilai ini
- `tanggal_dari`: Filter dari tanggal (format: YYYY-MM-DD)
- `tanggal_sampai`: Filter sampai tanggal (format: YYYY-MM-DD)
- `pelanggan_id`: Filter berdasarkan ID pelanggan
- `supplier_id`: Filter berdasarkan ID supplier

## Testing dengan cURL:

### Register & Login:

```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","role":"kasir"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Pelanggan:

```bash
# Create Pelanggan
curl -X POST http://localhost:3000/api/pelanggan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nama":"John Doe","no_hp":"08123456789","alamat":"Jl. Merdeka 123"}'

# Get All Pelanggan
curl -X GET "http://localhost:3000/api/pelanggan?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Produk:

```bash
# Create Produk
curl -X POST http://localhost:3000/api/produk \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Laptop ASUS","kategori":"Elektronik","harga_beli":5000000,"harga_jual":7000000,"stok":10}'

# Get Produk with filters
curl -X GET "http://localhost:3000/api/produk?search=laptop&kategori=elektronik" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Success Response Format:

```json
{
  "message": "Success message",
  "count": 10,
  "totalPages": 2,
  "currentPage": 1,
  "data": []
}
```
