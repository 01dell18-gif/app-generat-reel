# VibeGenesis - Platform Generasi Desain Otomatis & Asisten AI Visual Critique

Platform generasi desain multi-format terprogram untuk media sosial dengan mesin evaluasi visual berbasis AI multimodal dan algoritma deterministik WCAG 2.1 AA/AAA, dibangun berdasarkan spesifikasi penuh **[PRD.md](file:///d:/Downloads/Share-DKV%20F/COBA/coba%20coba/PRD.md)**.

---

## 🌟 Fitur Utama

### 1. Ingesti Aset Modular & Parameterisasi

- **Identitas Merek**: Logo vektor SVG / PNG transparan dengan penguncian koordinat (*layout locking*) 5% batas tepi untuk mencegah *geometry drift*.
- **Informasi Tekstual**: Teks judul utama (*headline*) dengan pembagian baris otomatis, penyesuaian ukuran font dinamis, dan teks sub-judul hierarkis.
- **Informasi Tanggal & Waktu**: Lencana tanggal kustom (*pill*, *rect*, *glass*) dengan penyesuaian kontras otomatis.
- **Media Utama & Isolasi Subjek**: Gambar subjek dengan segmentasi latar belakang otomatis dan pancaran aura neon, serta pemilih titik fokus *smart crop*.
- **Struktur Visual Bawah (Footer)**: Banner jangkar visual terkunci di area aman bawah (*bottom safe-zone*).
- **Elemen Grafis Pendukung**: Partikel kinetik, orbit cincin, bintang bercahaya (*sparkles*), dan penyesuaian skema warna merek.

### 2. Generasi Desain Multi-Format Terprogram

1. **Instagram Poster 1:1 (Square - 1080x1080)**: Komposisi kanvas interaktif Fabric.js dengan manipulasi *drag-and-drop*, perataan teks dinamis, dan ekspor PNG resolusi tinggi.
2. **Instagram Portrait 4:5 (1080x1350)**: Proporsi vertikal optimal untuk *feed* Instagram dengan adaptasi spasial otomatis.
3. **Instagram Reels 9:16 (Motion - 1080x1920)**: Mesin animasi berbasis linimasa 15 detik:
   - *Text Reveal Effect*: Animasi kemunculan teks judul kinetik dengan fisika *spring*.
   - *Staggered Entrance*: Kemunculan lencana tanggal bertahap.
   - *Pan & Zoom*: Efek gerak dinamis pada subjek visual.
   - *Kinetic Elements*: Partikel dan ornamen berputar tersinkronisasi waktu.
   - *Video Recorder & Export*: Perekaman video langsung di peramban ke format WebM / MP4 (60 FPS).

### 3. Mesin AI Visual Critic (Kerangka Kerja ACGT)

- **Analyze (Analisis Deterministik)**:
  - Formula *Perceptual Luminance* WCAG 2.1 untuk mengukur rasio kontras warna teks terhadap latar (Ambang batas $\ge 4.5:1$ teks normal, $\ge 3.0:1$ teks besar).
  - Evaluasi rasio hierarki tipografi Judul : Subjudul ($2.0\times - 2.5\times$).
  - Deteksi batas *Safe-Zone* (marjin minimum 24px dari area tertutup UI Instagram).
  - Pengukuran kerapatan visual kanvas (*visual density* target 30% - 70%).
- **Clarify (Translasi Konseptual)**:
  - Diagnosis kesalahan desain dalam bahasa alami yang jelas dan terstruktur.
- **Guide (Instruksi Tindakan)**:
  - Rekomendasi perbaikan terprogram dalam skema JSON (*machine-readable*).
  - Indikator *Bounding Box* interaktif di atas kanvas dengan kode unik kesalahan (misal: `ERR_CONTRAST_HEADLINE`, `ERR_HIERARCHY_RATIO`, `ERR_SAFEZONE_REELS_FOOTER`).
- **Track (Pelacakan Iterasi)**:
  - Log riwayat iterasi perbaikan yang mencatat peningkatan skor desain sebelum dan sesudah tindakan.
- **Deterministic Fallback Mechanism**:
  - Apabila pemanggilan API MLLM mengalami *timeout* atau offline, sistem secara otomatis beralih menggunakan algoritma lokal deterministik tanpa mengganggu alur kerja pengguna.

### 4. Fitur Auto-Fix Instan (< 200 milidetik)

- Tombol **"Perbaiki Semua Otomatis"** dan **"Terapkan Auto-Fix"** untuk setiap isu.
- Mengaplikasikan nilai properti warna, ukuran font, dan koordinat optimal secara langsung pada kanvas Fabric.js.
- Animasi selebrasi confetti saat kualitas desain mencapai skor kelulusan $\ge 90+$.

### 5. Instagram UI Safe-Zone Overlay

- Lapisan simulasi transparan antarmuka bawaan Instagram:
  - *Post Overlay*: Header akun, tombol like, comment, share, bookmark, dan caption.
  - *Reels Overlay*: Status bar atas, kolom aksi kanan (heart count, comment, share, audio disc spinning), dan deskripsi bawah.

### 6. Rotasi, Mirror (Flip) & Pindah Posisi Media / Background

- **Auto-Frame Lengkung Logo Instansi**: Gambar logo apapun yang diunggah (meski berformat kotak dengan latar putih/padat) secara otomatis dibingkai melengkung estetik (*curved capsule / rounded badge*), dilengkapi *clip-path* sehingga sudut kotak tajam terpotong mulus.
- **Rotasi Presisi**: Tombol cepat putar $-90^\circ$ / $+90^\circ$ dan *slider* bebas derajat ($-180^\circ$ s/d $+180^\circ$) untuk foto subjek utama dan layer latar belakang.
- **Mirroring / Flip**: Balik horizontal (Flip H) dan balik vertikal (Flip V) instan pada kanvas poster maupun animasi gerak Reels 9:16.
- **Multi-Background Layers (Max 4)**: Manajemen hingga 4 layer gambar latar dengan kontrol rotasi, flip, opacity, urutan layer (*z-index*), serta **Pindah Posisi (Offset X & Y)** dengan slider, D-Pad, atau *drag-and-drop* langsung pada kanvas.

### 7. Database Desain & Sinkronisasi Antar Perangkat

- **Database Klien (IndexedDB)**: Menyimpan otomatis aset dan project desain dalam penyimpanan lokal browser tanpa batasan ukuran file.
- **Database Server Terpusat (`/api/projects`)**: Menyimpan komposisi project ke file server (`data/projects.json`), sehingga desain yang disimpan di komputer dapat langsung dibuka dan disunting dari HP atau tablet di jaringan yang sama.

### 8. Rekomendasi Cerdas Desain AI & Studio Google Gemini

- **Prompt Generator Otomatis & AI Visual Assets**: Masukkan ide tema acara apa saja (misal: "Hari Pahlawan", "Turnamen E-Sport", "Dies Natalis"), Gemini AI secara otomatis merancang judul headline, lencana tanggal, kartu SPMI/kegiatan, banner atas, palet warna WCAG AA, serta **membuat aset visual (Background AI & Subjek Pejuang/Hero AI)** dalam format vektor SVG siap terap langsung ke kanvas.
- **Koneksi Resmi Model Gemini**: Sinkronisasi dinamis daftar model (`gemini-2.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`, dll.) langsung dengan kuota API Key pengguna Google AI Studio.
- **Gemini Vision Critic**: Pemindaian tangkapan kanvas multimodal untuk evaluasi komposisi visual.

### 9. Kustomisasi Lengkap Warna Footer Media Sosial & Brand FYJ

- **Identitas Resmi FYJ Channel**: Logo resmi bentuk pill melengkung halus (*frosted glass crest*), handles `@fyjchannel`, dan website `fyjchannel.co.id`.
- **Palet Terintegrasi & Ukuran Teks**: Pengaturan warna latar footer bar (*pill*), warna teks dan ikon SVG vektor (Instagram, Website, Facebook, TikTok), warna garis tepi (*border*), serta slider ukuran font dinamis (11px s/d 18px).
- **Penyesuaian Adaptif**: Sinkronisasi otomatis di kanvas statis 1:1, 4:5, maupun video bergerak Reels 9:16.

### 10. Desain Responsif Penuh untuk Perangkat Smartphone & Mobile

- **Mobile Viewport Optimization**: Kanvas Fabric.js otomatis diskalakan dengan *auto-scale transform* agar pas sempurna di layar smartphone tanpa terpotong (*no clipping*).
- **Mobile Bottom Navigation**: Tampilan tab navigasi bawah (*bottom bar*) ramah sentuhan (Upload, Teks 1, Teks 2, Sosmed, Database, Gemini AI) dengan drawer geser yang nyaman digunakan satu tangan di HP.

---

## 🏗️ Tumpukan Teknologi

| Komponen | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 18, Next.js 14 (App Router) |
| **Styling & UI Design** | Vanilla CSS Design System (Glassmorphism, Dark Mode, Glow Tokens) |
| **Interactive Canvas Engine** | Fabric.js (HTML5 Canvas 2D) |
| **Motion Video Engine** | Programmatic Canvas Motion Engine (Remotion Architecture) |
| **AI Critic & Evaluator** | ACGT Rule Engine, WCAG 2.1 Luminance Analyzer |
| **AI Microservice Bridge** | Python 3.15 Microservice (`backend/ai_critic_service.py`) |
| **Icons & Micro-animations** | Lucide React, Canvas Confetti |

---

## 🚀 Panduan Menjalankan Aplikasi

### Cara 1: Menggunakan File BAT (1-Klik Otomatis) ⭐ Paling Mudah

Cukup **klik dua kali (double click)** file:
📁 **`JALANKAN_APLIKASI.bat`**

File batch ini akan otomatis:
1. Memeriksa ketersediaan Node.js dan menginstal dependensi jika belum ada.
2. Mendeteksi IP Wi-Fi / LAN komputer Anda secara otomatis.
3. Membuka peramban di komputer Anda ke **`http://localhost:3030`**.
4. Menampilkan alamat IP untuk HP / perangkat lain di jendela Command Prompt.

---

### Cara 2: Melalui Terminal / Command Prompt

```bash
# 1. Instal dependensi (hanya perlu saat pertama kali)
npm install

# 2. Jalankan server studio (berjalan di port 3030 untuk semua jaringan)
npm run dev
```

---

### 📱 Petunjuk Penggunaan di Perangkat Lain (HP, Tablet, Laptop Lain)

1. **Pastikan Terhubung ke Jaringan yang Sama**:
   Hubungkan HP/Tablet dan Komputer ke jaringan **Wi-Fi yang sama**.
2. **Ketik Alamat URL di Browser HP**:
   Buka Google Chrome atau Safari di HP, lalu masukkan alamat:
   **`http://<IP-KOMPUTER>:3030`** (Contoh: **`http://10.10.10.159:3030`**).
   *(Atau di komputer, klik tombol **"Buka di HP"** di bilah atas untuk menampilkan QR Code, lalu scan dengan kamera HP).*
3. **Jika HP Mengalami Kendala (Loading terus / Tidak bisa terbuka)**:
   Windows Firewall di komputer Anda mungkin membatasi koneksi masuk. Cukup klik kanan file:
   📁 **`IZINKAN_FIREWALL_PORT_3030.bat`** &rarr; pilih **"Run as administrator"**.

---

### 3. Menjalankan Python AI Microservice Bridge (Opsional)

```bash
python backend/ai_critic_service.py 8000
```

Layanan REST API Python akan aktif di **`http://127.0.0.1:8000`** untuk menerima data aset dan mengembalikan evaluasi ACGT dalam format JSON terstruktur.

---

## 📁 Struktur Direktori

```text
├── PRD.md                           # Dokumen Spesifikasi Produk Asli
├── README.md                        # Dokumentasi Panduan Lengkap
├── package.json                     # Konfigurasi dependensi dan skrip
├── tsconfig.json                    # Konfigurasi TypeScript
├── next.config.js                   # Konfigurasi Next.js & Fabric externals
├── JALANKAN_APLIKASI.bat            # Script 1-Klik Jalankan Studio Desain di Windows
├── IZINKAN_FIREWALL_PORT_3030.bat   # Script Izin Firewall untuk Akses dari HP
├── data/
│   └── projects.json                # Database Server Sinkronisasi Antar-Perangkat
├── backend/
│   └── ai_critic_service.py         # Python AI Microservice Bridge & WCAG Engine
└── src/
    ├── app/
    │   ├── globals.css              # Design System Vanilla CSS (Dark Glassmorphism)
    │   ├── layout.tsx               # Root Layout & Metadata SEO
    │   ├── page.tsx                 # Halaman Utama Studio Desain
    │   └── api/
    │       ├── critic/route.ts      # Next.js API Route untuk ACGT Critic Engine
    │       ├── gemini/route.ts      # Next.js API Route untuk Google Gemini Multimodal
    │       └── projects/route.ts    # Next.js API Route untuk Database Server Proyek
    ├── components/
    │   ├── Navbar.tsx               # Header, Selector Format, Dropdown 10 Preset, Export
    │   ├── InteractiveCanvas.tsx    # Mesin Kanvas Fabric.js, Bounding Box, & Auto-Scale HP
    │   ├── ReelsMotionPlayer.tsx    # Mesin Animasi Video Reels 9:16 & Perekam WebM/MP4
    │   ├── CriticDrawer.tsx         # Panel ACGT Inspector, Skor Kualitas, & Auto-Fix
    │   ├── AssetIngestionPanel.tsx  # Ingesti Aset, Multi-Layer BG, Media Sosial & Brand FYJ
    │   └── GeminiAIModal.tsx        # Modal AI Studio: Prompt Generator, Aset AI & Vision
    ├── lib/
    │   ├── critic-engine.ts         # Evaluasi Deterministik WCAG 2.1 AA/AAA & ACGT Engine
    │   ├── preset-templates.ts      # 10 Template Desain Siap Pakai & Library Background
    │   ├── ai-generative-assets.ts  # Generator Aset Vektor Cerdas AI (Background & Subjek)
    │   ├── asset-database.ts        # Klien Sinkronisasi Database Proyek
    │   └── social-footer-svg.ts     # Generator SVG Footer Media Sosial (IG, Web, FB, TikTok)
    └── types/
        └── design.ts                # TypeScript Schema Sistem Desain Multimodal
```
