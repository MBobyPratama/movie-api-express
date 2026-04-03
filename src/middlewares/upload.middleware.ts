import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Buat folder 'uploads' otomatis jika belum ada
const uploadDirectory = 'uploads';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Konfigurasi tempat penyimpanan dan penamaan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Simpan di folder /uploads
  },
  filename: function (req, file, cb) {
    // Format nama file: timestamp_namaAsli (agar tidak ada nama duplikat)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Inisialisasi multer
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batasan ukuran file maksimal 5MB
});
