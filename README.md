# React + Vite
✈️ Travel Nusantara: Website Pemesanan Wisata Jawa, Bali, & LombokIni adalah proyek aplikasi Full-Stack untuk manajemen dan pemesanan paket wisata di wilayah Jawa, Bali, dan Lombok. Dibangun menggunakan teknologi modern (MERN-stack inspired) untuk kecepatan, skalabilitas, dan pengalaman pengguna yang optimal.✨ 
Fitur Utama (Core Features)
Website ini mencakup alur lengkap dari pencarian paket oleh Client hingga verifikasi laporan oleh Admin.
RoleFiturStatusPublik/ClientPencarian & Tampilan Detail Paket✅
ClientRegistrasi & Login Aman (JWT + Bcrypt)✅
ClientForm Pemesanan (Booking)✅
ClientUser Dashboard (Riwayat Pemesanan)✅
ClientUpload Bukti Pembayaran✅
AdminAdmin Dashboard (Statistik, Laporan)✅
AdminManajemen Konten Paket (Tambah Paket)✅
AdminVerifikasi Pembayaran (Ubah Status)✅
AdminEkspor Laporan ke Excel (.xlsx)✅

💻 Teknologi yang Digunakan (Tech Stack)BagianTeknologiDetailFrontendReact.js (dengan Vite)Component-based UI dan navigasi (React Router DOM).StylingTailwind CSSUtility-first CSS untuk desain yang responsive dan cepat. Font Oswald digunakan untuk styling utama.BackendNode.js (dengan Express)RESTful API untuk logika bisnis dan routing.DatabaseMySQL (via XAMPP)Database relasional untuk menyimpan data Pemesanan, User, dan Paket Wisata.KeamananJWT & BcryptjsOtentikasi sesi dan hashing password.File HandlingMulterMiddleware untuk menangani upload file (bukti pembayaran).📁 Struktur Proyek (Project Structure)Proyek ini menggunakan struktur Full-Stack Separated:Travel-Nusantara

├── backend/                  <-- Server (Node.js, Express, MySQL)
│   ├── routes/               (auth, booking, admin, packages)
│   ├── middleware/           (auth.js, adminAuth.js)
│   ├── uploads/              (Folder penyimpanan Bukti Pembayaran)
│   ├── server.js             (File utama)
│   └── .env                  (Kredensial DB dan JWT)
│
└── web/                      <-- Frontend (React, Vite, Tailwind CSS)
    ├── src/
    │   ├── components/       (Header, Login, PackageForm, AdminDashboard, dll.)
    │   ├── App.jsx           (Root Router)
    │   └── main.jsx
    └── package.json          (Dependencies Frontend)
    
🚀 Panduan Instalasi dan Menjalankan ProyekIkuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal.
PrasyaratNode.js (LTS Version)MySQL Server (XAMPP/WAMP/MAMP harus running)
1. Setup Backend (Server & Database)
2. A. Database SetupBuka tool MySQL Anda (phpMyAdmin).Buat database dengan nama travel_db.
3. Buat file .env di folder backend:DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_db
PORT=5000
JWT_SECRET=KUNCI_RAHASIA_PANJANG_DAN_ACAK
B. Menjalankan ServerDi Terminal/PowerShell, navigasi ke folder backend.
Instal dependencies: npm install
Jalankan server: node server.js(Server API akan berjalan di http://localhost:5000)
2. Setup Frontend (React)
3. A. InstalasiBuka Terminal baru, navigasi ke folder web.
4. Instal dependencies: npm install
5. B. Menjalankan Aplikasi
6. Jalankan aplikasi: npm run dev(Aplikasi akan terbuka di http://localhost:5173 atau port lain.)
7. 🔑 Akses DefaultAkunEmailPasswordCatatanAdmin(Perlu register lalu ubah role di DB)
8. Password Pilihan AndaAkses ke /admin/dashboardClient(Register Akun Baru)Password Pilihan AndaAkses ke /dashboard
