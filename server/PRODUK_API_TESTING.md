# PRODUK API - TESTING DENGAN POSTMAN

## Base URL

```
http://localhost:3000/api/produk
```

## Headers yang Diperlukan

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## 1. Membuat Produk Baru

**POST** `/api/produk`

### Request Body:

```json
{
  "nama": "Laptop Gaming",
  "kategori_id": 1,
  "harga_beli": 8000000,
  "harga_jual": 10000000,
  "stok": 5
}
```

### Response (Success):

```json
{
  "message": "Produk berhasil dibuat",
  "produk": {
    "id": 1,
    "nama": "Laptop Gaming",
    "ProdukKategoriId": 1,
    "harga_beli": "8000000.00",
    "harga_jual": "10000000.00",
    "stok": 5,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "ProdukKategori": {
      "id": 1,
      "nama": "Elektronik"
    }
  }
}
```

## 2. Mendapatkan Semua Produk

**GET** `/api/produk`

### Query Parameters (Optional):

- `page`: nomor halaman (default: 1)
- `limit`: jumlah data per halaman (default: 10)
- `search`: kata kunci pencarian
- `kategori_id`: filter berdasarkan ID kategori
- `stok_minimum`: filter produk dengan stok <= nilai ini

### Contoh URL:

```
GET /api/produk?page=1&limit=5&search=laptop&kategori_id=1
```

### Response:

```json
{
  "message": "Data produk berhasil diambil",
  "count": 1,
  "totalPages": 1,
  "currentPage": 1,
  "filters": {
    "kategori_id": "1",
    "stok_minimum": null,
    "search": "laptop"
  },
  "produk": [
    {
      "id": 1,
      "nama": "Laptop Gaming",
      "ProdukKategoriId": 1,
      "harga_beli": "8000000.00",
      "harga_jual": "10000000.00",
      "stok": 5,
      "ProdukKategori": {
        "id": 1,
        "nama": "Elektronik"
      }
    }
  ]
}
```

## 3. Mendapatkan Produk Berdasarkan ID

**GET** `/api/produk/:id`

### Contoh:

```
GET /api/produk/1
```

### Response:

```json
{
  "message": "Data produk berhasil diambil",
  "produk": {
    "id": 1,
    "nama": "Laptop Gaming",
    "ProdukKategoriId": 1,
    "harga_beli": "8000000.00",
    "harga_jual": "10000000.00",
    "stok": 5,
    "ProdukKategori": {
      "id": 1,
      "nama": "Elektronik"
    }
  }
}
```

## 4. Update Produk

**PUT** `/api/produk/:id`

### Request Body:

```json
{
  "nama": "Laptop Gaming Updated",
  "kategori_id": 2,
  "harga_beli": 8500000,
  "harga_jual": 11000000,
  "stok": 3
}
```

### Response:

```json
{
  "message": "Produk berhasil diupdate",
  "produk": {
    "id": 1,
    "nama": "Laptop Gaming Updated",
    "ProdukKategoriId": 2,
    "harga_beli": "8500000.00",
    "harga_jual": "11000000.00",
    "stok": 3,
    "ProdukKategori": {
      "id": 2,
      "nama": "Komputer"
    }
  }
}
```

## 5. Update Stok Produk

**PUT** `/api/produk/:id/stok`

### Request Body (Menambah Stok):

```json
{
  "stok_perubahan": 10,
  "tipe": "tambah"
}
```

### Request Body (Mengurangi Stok):

```json
{
  "stok_perubahan": 5,
  "tipe": "kurang"
}
```

### Response:

```json
{
  "message": "Stok produk berhasil ditambah",
  "produk": {
    "id": 1,
    "nama": "Laptop Gaming Updated",
    "kategori": "Komputer",
    "stok_lama": 3,
    "stok_baru": 13,
    "perubahan": "+10"
  }
}
```

## 6. Hapus Produk

**DELETE** `/api/produk/:id`

### Response:

```json
{
  "message": "Produk berhasil dihapus",
  "deletedProduk": {
    "id": 1,
    "nama": "Laptop Gaming Updated",
    "kategori": "Komputer"
  }
}
```

## 7. Mendapatkan Produk dengan Stok Rendah

**GET** `/api/produk/stok-rendah`

### Query Parameters (Optional):

- `batas`: batas maksimal stok (default: 10)

### Contoh:

```
GET /api/produk/stok-rendah?batas=5
```

### Response:

```json
{
  "message": "Produk dengan stok <= 5",
  "count": 2,
  "batas_stok": 5,
  "produk": [
    {
      "id": 2,
      "nama": "Mouse Gaming",
      "stok": 2,
      "ProdukKategori": {
        "id": 1,
        "nama": "Elektronik"
      }
    }
  ]
}
```

## 8. Mendapatkan Produk Berdasarkan Kategori

**GET** `/api/produk/kategori/:kategoriId`

### Contoh:

```
GET /api/produk/kategori/1
```

### Response:

```json
{
  "message": "Produk dalam kategori: Elektronik",
  "kategori": {
    "id": 1,
    "nama": "Elektronik"
  },
  "count": 3,
  "produk": [
    {
      "id": 1,
      "nama": "Laptop Gaming",
      "ProdukKategoriId": 1,
      "harga_beli": "8000000.00",
      "harga_jual": "10000000.00",
      "stok": 5,
      "ProdukKategori": {
        "id": 1,
        "nama": "Elektronik"
      }
    }
  ]
}
```

## VALIDASI DAN ERROR RESPONSES

### Error Validation (400):

```json
{
  "message": "Nama produk harus diisi"
}
```

### Kategori Tidak Ditemukan (404):

```json
{
  "message": "Kategori tidak ditemukan"
}
```

### Produk Sudah Ada (409):

```json
{
  "message": "Produk dengan nama tersebut sudah ada"
}
```

### Harga Tidak Valid (400):

```json
{
  "message": "Harga jual harus lebih besar dari harga beli"
}
```

## CATATAN PENTING

1. **kategori_id** adalah WAJIB menggunakan ID dari tabel ProdukKategori
2. **harga_jual** harus lebih besar dari **harga_beli**
3. **stok** tidak boleh negatif
4. **nama** produk harus unik
5. Sebelum menambah produk, pastikan kategori sudah ada di tabel ProdukKategori

## CONTOH TESTING SEQUENCE

1. Buat kategori terlebih dahulu melalui `/api/produk-kategori`
2. Gunakan ID kategori yang didapat untuk membuat produk
3. Test semua endpoint dengan data yang valid
4. Test error handling dengan data yang tidak valid
