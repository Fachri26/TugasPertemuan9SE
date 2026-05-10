**Muhammad Fachri Wiryansyah**
**2410511096**

Proyek ini adalah implementasi sistem manajemen pesanan menggunakan arsitektur microservices yang dibangun dengan Node.js. Sistem ini mencakup autentikasi, manajemen produk, pemesanan, dan pemrosesan latar belakang dengan rabbitmq.

## Arsitektur Sistem

Sistem ini terdiri dari beberapa komponen utama:
1.  **API Gateway (Port 4096):** Sebagai Entry Point tunggal. Mengatur routing ke service yang sesuai.
2.  **Auth Service (Port 4196):** Mengelola pendaftaran pengguna, login (JWT), dan open autentication dengan google.
3.  **Order Service (Port 4296):** Mengelola katalog produk dan pembuatan pesanan.
4.  **Consumer Service:** Service yang berjalan di latar belakang untuk memproses antrean pesan.
5.  **Message Broker (RabbitMQ):** Menghubungkan Order Service dan Consumer secara asynchronous.
6.  **Database (MySQL):** Menggunakan basis data terpisah untuk masing-masing service (Database-per-Service).

## Cara Menjalankan Service

### Prasyarat
- Node.js terinstal
- MySQL terinstal dan berjalan
- Docker Desktop (untuk RabbitMQ)
- PM2 terinstal (`npm install pm2 -g`)

### Langkah-langkah Penginstalan

1. **Persiapan Database:**
   Buat database MySQL bernama `auth_db` dan `order_db` di MySQL server lokal Anda.

2. **Jalankan RabbitMQ:**
   
3. **Instalasi Dependensi:**
```bash
cd auth-service && npm install
cd ../order-service && npm install
cd ../api-gateway && npm install
cd ../consumer && npm install 
``` 
4. Konfigurasi Environment
    Pastikan setiap folder memiliki file .env dengan konfigurasi yang sesuai (DB_HOST, DB_USER, JWT_SECRET, dll).

5. Menjalankan Sistem dengan PM2 dan monitoring
```bash
pm2 start ecosystem.config.js
pm2 logs
```

# DAFTAR ENDPOINT & RESPONSE

```bash
# Register
POST --> http://localhost:4096/auth/auth/register --> req(name, email, password)
{
    "message": "User registered"
}

#Login
POST --> http://localhost:4096/auth/auth/login --> req(email, password)
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6InVzZXIiLCJpYXQiOjE3Nzg0MDQzNTAsImV4cCI6MTc3ODQwNzk1MH0.xizgV-B3uAUf1VInita-4gXS4N_8gYD74xPZCLXB7b4"
}

#OAuth
GOOGLE --> http://localhost:4096/auth/auth/google
{"message":"Google login success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc4NDAzNzY0LCJleHAiOjE3Nzg0MDczNjR9.1pg2_kSJZU1HkXKc_Nuig-PdQRUpYQE5l_gNGIrM_pA"}

# Delete
DELETE --> http://localhost:4096/auth/auth/users/:id --> bearer token, admin only
{
    "message": "User soft deleted"
}

# Create Product
POST --> http://localhost:4096/api/api/products --> bearer token, admin only, req(name, price)
{
    "message": "Product created",
    "productId": 2
}

# Product List
GET --> http://localhost:4096/api/api/products --> bearer token
[
    {
        "id": 1,
        "name": "Laptop",
        "price": 15000000,
        "created_at": "2026-05-08T13:54:04.000Z",
        "updated_at": "2026-05-08T13:54:04.000Z"
    },
    {
        "id": 2,
        "name": "monitor",
        "price": 4000000,
        "created_at": "2026-05-10T09:15:41.000Z",
        "updated_at": "2026-05-10T09:15:41.000Z"
    }
]

# Create Order
POST --> http://localhost:4096/api/api/orders --> bearer token, req(product_id, quantity)
{
    "message": "Order created",
    "orderId": 3
}
```