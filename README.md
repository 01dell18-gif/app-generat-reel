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

### 6. Rotasi & Mirror (Flip) Media Terunggah

- **Rotasi Presisi**: Tombol cepat putar $-90^\circ$ / $+90^\circ$ dan *slider* bebas derajat ($-180^\circ$ s/d $+180^\circ$) untuk foto subjek utama dan layer latar belakang.
- **Mirroring / Flip**: Balik horizontal (Flip H) dan balik vertikal (Flip V) instan pada kanvas poster maupun animasi gerak Reels 9:16.
- **Multi-Background Layers**: Manajemen hingga 4 layer gambar latar dengan kontrol rotasi, flip, opacity, dan urutan layer (*z-index*).

### 7. Rekomendasi Cerdas Desain AI & Studio Google Gemini

- **Rekomendasi Cerdas 1-Klik**: Preset teruji untuk Resmi SPMI, Semangat Vokasi & Hari Pahlawan, Dies Natalis & Prestasi Unggulan, serta Hari Guru & Karakter Bangsa.
- **Koneksi Resmi Model Gemini**: Sinkronisasi dinamis daftar model (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`, dll.) langsung dengan kuota API Key pengguna Google AI Studio.
- **Gemini Vision Critic**: Pemindaian tangkapan kanvas multimodal untuk evaluasi komposisi visual.

### 8. Kustomisasi Lengkap Warna Footer Media Sosial

- **Palet Terintegrasi**: Pengaturan warna latar footer bar (*pill*), warna teks dan ikon SVG vektor (Instagram, Website, Facebook, TikTok), serta warna garis tepi (*border*).
- **Penyesuaian Adaptif**: Sinkronisasi otomatis di kanvas statis 1:1, 4:5, maupun video bergerak Reels 9:16.

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

### 1. Menjalankan Frontend Studio (Next.js)

```bash
# Instal dependensi (jika belum)
npm install

# Jalankan server pengembangan
npm run dev
```

Akses platform melalui peramban: **`http://localhost:3000`**

### 2. Menjalankan Python AI Microservice Bridge (Opsional)

```bash
python backend/ai_critic_service.py 8000
```

Layanan REST API Python akan aktif di **`http://127.0.0.1:8000`** untuk menerima data aset dan mengembalikan evaluasi ACGT dalam format JSON terstruktur.

---

## 📁 Struktur Direktori

```text
├── PRD.md                           # Dokumen Spesifikasi Produk Asli
├── package.json                     # Konfigurasi dependensi dan skrip
├── tsconfig.json                    # Konfigurasi TypeScript
├── next.config.js                   # Konfigurasi Next.js & Fabric externals
├── backend/
│   └── ai_critic_service.py         # Python AI Microservice Bridge & WCAG Engine
└── src/
    ├── app/
    │   ├── globals.css              # Design System Vanilla CSS (Dark Glassmorphism)
    │   ├── layout.tsx               # Root Layout & Metadata SEO
    │   ├── page.tsx                 # Halaman Utama Studio Desain
    │   └── api/
    │       └── critic/route.ts      # Next.js API Route untuk ACGT Critic Engine
    ├── components/
    │   ├── Navbar.tsx               # Header, Selector Format, Presets, Export
    │   ├── InteractiveCanvas.tsx    # Mesin Kanvas Fabric.js & Bounding Box Overlay
    │   ├── ReelsMotionPlayer.tsx    # Mesin Animasi Video Reels 9:16 & Perekam MP4
    │   ├── CriticDrawer.tsx         # Panel ACGT Inspector, Metrik, & Riwayat
    │   └── AssetIngestionPanel.tsx  # Ingesti Tipografi, Media, Branding, Footer
    ├── lib/
    │   ├── critic-engine.ts         # Logika Evaluasi Deterministik WCAG 2.1 & ACGT
    │   └── preset-templates.ts      # 3 Preset Desain Siap Pakai & Vektor SVG
    └── types/
        └── design.ts                # TypeScript Schema sesuai PRD Section 3.3
```
