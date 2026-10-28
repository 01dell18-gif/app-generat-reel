# **Product Requirement Document (PRD): Platform Generasi Desain Otomatis dan Asisten AI Visual Critique**

## **Ringkasan Eksekutif dan Arsitektur Konseptual**

Tingginya kebutuhan produksi konten media sosial dalam format bervariasi—mulai dari Instagram Poster statis berorientasi rasio 1:1 dan 4:5 hingga video bergerak vertikal Instagram Reels berorientasi 9:16—menciptakan tantangan efisiensi bagi tim kreatif dan pemilik usaha1. Pendekatan perancangan manual sering kali memperlambat alur kerja karena pengulangan tata letak aset dasar seperti logo, judul, tanggal, dan elemen dekoratif3. Platform yang dirancang dalam dokumen ini menjawab tantangan tersebut melalui penggabungan dua sistem utama: mesin komposisi spasial terprogram (*programmatic layout & motion engine*) dan mesin evaluasi visual berbasis kecerdasan buatan multimodal (*multimodal AI visual design critic*)5.  
Sistem ini dirancang untuk menerima sekumpulan aset mentah dari pengguna yang mencakup logo merek, teks judul utama, teks informasi tanggal, gambar *footer*, gambar subjek utama, serta elemen pendukung lainnya3. Menggunakan prinsip desain modular berbasis parameter, sistem mengisolasi setiap input ke dalam lapisan kanvas terpisah yang disesuaikan secara otomatis berdasarkan aturan komposisi visual4.  
Guna memastikan bahwa hasil generasi otomatis memenuhi standar estetika dan Keterbacaan, platform mengintegrasikan modul AI yang bertindak sebagai kritikus desain visual5. Modul ini menggabungkan analisis *computer vision* deterministik untuk mengukur parameter objektif seperti kontras warna dan batas area aman (*safe zone*), dengan *Multimodal Large Language Model* (MLLM) untuk memberikan saran perbaikan berbasis hierarki visual dan tata letak secara waktu nyata (*real-time*)5.  
Transformasi data dalam platform beroperasi melalui alur kerja berurutan yang berkelanjutan. Pengguna memulai dengan mengunggah aset visual dan teks melalui modul *ingestion*. Data tersebut diproses oleh mesin komposisi terprogram yang memetakan elemen ke koordinat kanvas sesuai target format luaran4. Hasil rendering kanvas kemudian dikirim ke modul AI Visual Critic untuk dianalisis kecocokan kontras, hierarki tipografi, dan keseimbangan spasialnya5. Setelah AI memberikan saran perbaikan terstruktur atau menerapkan penyesuaian otomatis (*auto-fix*), sistem menghasilkan berkas luaran beresolusi tinggi berupa gambar statis atau video MP4 teranimasi6.

## **Spesifikasi Ingesti Aset dan Pemrosesan Multi-Format**

Sistem diarsitekturi untuk mengisolasi setiap input pengguna ke dalam struktur data berparameter12. Pengisolasian ini memungkinkan mesin desain melakukan kalkulasi posisi spasial dinamis saat menyesuaikan tata letak antar format luaran yang berbeda4.

### **Komponen Input Aset**

Input dari pengguna dikelompokkan menjadi lima kategori utama:

> 1. **Identitas Merek**: Logo dalam format Vektor (SVG) atau Raster transparan (PNG high-DPI) dengan penentuan *bounding box* otomatis7.  
> 2. **Informasi Tekstual**: Teks judul utama (*headline*), sub-judul, dan informasi tanggal atau waktu kegiatan dengan dukungan UTF-8 penuh3.  
> 3. **Struktur Visual Bawah**: Gambar *footer* atau pita informasi bawah yang berfungsi sebagai jangkar visual (*visual anchor*) komposisi13.  
> 4. **Media Utama**: Gambar subjek atau latar belakang yang diolah melalui algoritma isolasi latar belakang otomatis berbasis segmentasi instans14.  
> 5. **Elemen Grafis Pendukung**: Ikon, bentuk geometris, stiker, dan bingkai aksen yang dapat dipersonalisasi skema warnanya sesuai identitas visual merek3.

### **Matriks Pemrosesan Spasial Aset**

| Komponen Input | Format Input | Parameter Transformasi Visual | Adaptasi Layout Poster (1:1 / 4:5) | Adaptasi Layout Reel (9:16) |
| :---- | :---- | :---- | :---- | :---- |
| **Logo Merek** | SVG, PNG Transparan | *Scaling* Vektor, Preservasi Rasio Aspek | Diposisikan pada pojok atas dengan marjin 5% dari tepi kanvas | Berada di area aman atas (*top safe-zone*), menghindari overlay antarmuka aplikasi |
| **Teks Judul** | String (UTF-8) | Ukuran Font Dinamis, *Line-height*, Pemutusan Baris Otomatis | Perataan tengah atau kiri, maksimal 3 baris teks | Teks bergerak dengan animasi kemunculan (*text reveal effect*) terstruktur |
| **Teks Tanggal** | Date-Time / String | Pengubah Latar Belakang Lencana (*Badge*), Penyesuaian Kontras | Diposisikan pada area menengah-atas atau sejajar elemen tindakan (*CTA*) | Animasi pencetus bertahap (*staggered fade-in*) berbasis linimasa |
| **Gambar Utama** | JPEG, PNG, WebP | Pemotongan Cerdas (*Smart Crop*), Isolasi Latar Belakang | Fokus pada titik tengah visual, penerapan *clipping mask* | Efek gerak *Pan & Zoom* sepanjang durasi pemutaran video |
| **Footer Gambar** | PNG, SVG | Rentang Horisontal Responsif, Skala Ketinggian Tetap | Menutup 10% hingga 15% area dasar kanvas | Terkunci di area aman bawah (*bottom safe-zone*) di atas deskripsi video |
| **Elemen Grafis** | SVG, Layer PNG | Pewarnaan Ulang (*Tinting*), Penyusunan Z-Index | Aksen dekoratif di sudut kanvas atau pembatas informasi | Elemen teranimasi berbasis gerak partikel atau Gerak Kinetik |

## **Arsitektur Modul AI Visual Design Critic dan Feedback System**

Tantangan utama dari sistem generasi desain otomatis adalah risiko ketidakseimbangan visual ketika variabel teks atau dimensi gambar memiliki panjang dan proporsi yang tidak konvensional15. Platform ini mengatasi keterbatasan tersebut dengan mengintegrasikan mesin evaluasi dua lapis yang menggabungkan kalkulasi *computer vision* deterministik dengan kapabilitas penalaran *Multimodal Large Language Model* (MLLM)5.

### **Kerangka Kerja Evaluasi ACGT**

Proses analisis dan koreksi desain dijalankan berdasarkan kerangka kerja ACGT (*Analyze, Clarify, Guide, Track*) yang dirancang untuk mengonversi data mentah gambar menjadi rekomendasi praktis5:

> 1. **Analyze (Analisis Deterministik)**: Sistem menangkap matriks piksel dari kanvas dan mengekstraksi data koordinat *bounding box* seluruh objek5. Algoritma khusus menghitung rasio kontras warna latar terhadap teks berdasarkan standar WCAG 2.1 AA/AAA, mendeteksi tumpang-tindih antar elemen, serta mengukur kerapatan visual (*visual density*)5.  
> 2. **Clarify (Translasi Konseptual)**: Data numerik dari tahap analisis ditranslasikan oleh MLLM menjadi konteks desain visual5. Modul mendiagnosis kesalahan spesifik seperti hilangnya hierarki informasi, ketidakseimbangan ruang kosong (*white space*), atau gangguan keterbacaan5.  
> 3. **Guide (Instruksi Tindakan)**: MLLM menghasilkan rekomendasi perbaikan berbasis koordinat dan properti gaya5. Rekomendasi disusun dalam struktur data yang dapat dibaca langsung oleh mesin (*machine-readable JSON*) maupun oleh pengguna manusia dalam bentuk teks5.  
> 4. **Track (Pelacakan Iterasi)**: Setiap koreksi yang diterapkan pada kanvas dicatat dalam log iterasi5. Sistem melakukan verifikasi ulang terhadap perubahan untuk memastikan skor kualitas desain secara keseluruhan mengalami peningkatan5.

### **Matriks Kategori Evaluasi AI Critic**

| Kategori Evaluasi | Metode Deteksi Utama | Ambang Batas & Parameter Validasi | Parameter Output JSON Schema |
| :---- | :---- | :---- | :---- |
| **Kontras Warna** | Formula *Perceptual Luminance* (WCAG 2.1)9 | Contrast Ratio ![Formula 1][image1] (Normal), ![Formula 2][image2] (Teks Besar)11 | contrast\_issues: \[{ element\_id, ratio, recommended\_hex }\]9 |
| **Hierarki Tipografi** | Ekstraksi OCR & Evaluasi Metrik Font5 | Skala Rasio Ukuran Judul:Subjudul:Body ![Formula 3][image3]16 | typography\_suggestions: \[{ layer\_id, current\_size, target\_size }\] |
| **Keseimbangan Spasial** | Deteksi Batas *Bounding Box* & Tepi5 | Marjin minimum 24px dari area tertutup UI media sosial | spatial\_violations: \[{ box\_id, coordinates, shift\_vector }\]7 |
| **Kerapatan Visual** | Pemetaan *Visual Salience* & Rasio Area5 | Area terisi pada kanvas antara ![Formula 4][image4] hingga ![Formula 5][image5] | layout\_density: { score, density\_status, action\_required }9 |

### **Struktur Data Schema Kritik Desain**

Keluaran dari AI Critic harus memenuhi skema JSON berikut untuk memfasilitasi penerapan *Auto-Fix* secara terprogram7:

| Field Nama | Tipe Data | Deskripsi Operasional |
| :---- | :---- | :---- |
| overall\_score | Integer (0-100) | Skor keseluruhan kualitas estetika dan keterbacaan desain9 |
| issue\_id | String | Kode unik identifikasi kesalahan (misal: ERR\_CONTRAST\_01) |
| category | Enum | Kategori kesalahan (color\_contrast, safe\_zone\_violation, hierarchy)9 |
| severity | Enum | Tingkat prioritas perbaikan (high, medium, low) |
| target\_layer | String | ID unik dari lapisan kanvas yang membutuhkan modifikasi |
| bounding\_box | Array of Int | Koordinat area bermasalah \[x, y, width, height\]7 |
| description | String | Uraian penjelasan kesalahan desain dalam bahasa alami5 |
| auto\_fix.property | String | Nama atribut gaya atau posisi yang harus diubah (misal: fill, fontSize) |
| auto\_fix.value | Any | Nilai parameter baru yang direkomendasikan untuk menyelesaikan masalah |

## **Arsitektur Teknikal dan Tumpukan Teknologi Platform**

Sistem ini dirancang menggunakan arsitektur mikro terpisah (*decoupled microservices architecture*) untuk memisahkan beban kerja render grafis interaktif pada peramban web dengan proses manipulasi video berdurasi berat pada server backend6.

### **Manipulasi Kanvas Statis (Fabric.js)**

Untuk pengolahan desain statis seperti Instagram Poster, platform memanfaatkan kerangka kerja Fabric.js pada sisi *frontend*6. Fabric.js menyediakan objek kanvas HTML5 interaktif yang memungkinkan manipulasi elemen secara penuh melalui kode program8. Setiap variabel seperti posisi koordinat, skala, warna, dan Z-index dihubungkan langsung dengan data JSON terstruktur8. Fitur ini memfasilitasi eksekusi fitur *Auto-Fix* dari AI Critic secara langsung tanpa memerlukan render ulang dari server backend8.

### **Generasi Video Terprogram (Remotion)**

Untuk pembuatan video bergerak Instagram Reels, platform mengintegrasikan kerangka kerja Remotion6. Remotion memungkinkan pembuatan video berbasis kode menggunakan komponen React, di mana linimasa animasi dikendalikan oleh fungsi berbasis *frame*6. Aset teks judul, tanggal, dan gambar dipetakan ke dalam templat animasi React6. Saat proses ekspor dimulai, platform memicu modul Remotion Lambda untuk melakukan rendering paralel berskala besar di infrastruktur *cloud serverless*, yang secara signifikan mengurangi waktu tunggu pembuatan file MP46.

### **Rekapitulasi Tumpukan Teknologi**

| Lapisan Sistem | Teknologi yang Digunakan | Fungsi Utama dalam Sistem |
| :---- | :---- | :---- |
| **Frontend Framework** | React.js, Next.js, Tailwind CSS | Antarmuka Pengguna, Manajemen State Kanvas, Dashboard Kontrol |
| **Interactive Canvas Engine** | Fabric.js (HTML5 Canvas Framework)6 | Render aset statis, manipulasi *drag-and-drop*, aplikasi *Auto-Fix*8 |
| **Video Rendering Engine** | Remotion / Remotion Lambda6 | Skrip animasi berbasis React, kompilasi video MP4 terprogram6 |
| **AI Microservice Bridge** | Python / Node.js, FastMCP Framework9 | Analisis *Computer Vision*, kalkulasi kontras, antarmuka MLLM API9 |
| **Multimodal Vision Engine** | OpenAI GPT-4o / Claude 3.5 Sonnet / Qwen-VL11 | Inferensi evaluasi estetika, pembentukan instruksi JSON Critic11 |
| **Database & Storage** | PostgreSQL, Redis, Amazon S3 / Cloudflare R2 | Penyimpanan template JSON, manajemen antrean render, hosting media |

## **Spesifikasi Alur Kerja Pengguna (User Flow)**

Alur kerja dirancang untuk meminimalkan kompleksitas teknis bagi pengguna akhir melalui pendekatan otomatisasi yang fleksibel2.  
Proses diawali ketika pengguna mengakses antarmuka pembuatan proyek dan mengunggah aset mentah yang meliputi logo, teks judul, tanggal, gambar *footer*, dan gambar utama3. Selanjutnya, pengguna memilih format luaran yang diinginkan, yaitu Instagram Poster statis atau Instagram Reels dinamis3.  
Setelah format dipilih, mesin tata letak terprogram secara otomatis menyusun komposisi awal berdasarkan variabel templat modular4. Kanvas yang telah terisi kemudian dipindai oleh modul AI Visual Critic secara latar belakang5. Hasil audit visual ditampilkan pada layar berupa petunjuk visual *bounding box* di atas area yang memerlukan penyesuaian, disertai laporan ringkas mengenai skor kontras dan hierarki5.  
Pengguna diberikan dua jalur keputusan: memilih opsi *Auto-Fix* untuk mengizinkan sistem menerapkan koreksi properti secara otomatis, atau melakukan penyesuaian manual melalui alat editor Fabric.js8. Setelah komposisi disetujui, pengguna menekan tombol ekspor3. Mesin akan mengekspor berkas PNG beresolusi tinggi untuk format statis, atau mengirimkan instruksi ke Remotion Lambda untuk mengompilasi video MP4 untuk format Reels6.

## **Kriteria Penerimaan Sistem (Acceptance Criteria)**

Pengujian fungsionalitas produk dievaluasi berdasarkan kriteria penerimaan terukur berikut:

### **1\. Ingesti dan Pemetaan Aset**

* **AC-01**: Sistem harus mampu memisahkan latar belakang gambar utama secara otomatis dengan tingkat akurasi isolasi subjek ![Simbol 6][image6].  
* **AC-02**: Logo dan *footer* yang diunggah harus secara otomatis terkunci pada rasio aspek aslinya dan diposisikan di dalam batas *safe-zone* spesifik platform tujuan.

### **2\. Generasi Multi-Format terprogram**

* **AC-03**: Rendering pratinjau kanvas statis berbasis Fabric.js harus selesai dan tampil di layar pengguna dalam waktu ![Simbol 7][image7] detik setelah aset selesai diunggah8.  
* **AC-04**: Rendering video Instagram Reels berdurasi 15 detik pada kualitas 1080x1920 (60 FPS) menggunakan Remotion Lambda harus selesai dalam waktu ![Simbol 8][image8] detik6.

### **3\. Modul AI Visual Design Critic**

* **AC-05**: Algoritma kontras warna harus secara akurat mengidentifikasi seluruh kombinasi teks dan latar belakang yang memiliki rasio kontras ![Simbol 9][image9] serta menyediakan alternatif warna terdekat yang lolos standar WCAG AA9.  
* **AC-06**: Struktur JSON yang dihasilkan oleh MLLM harus selalu valid dan sesuai dengan *schema* yang ditetapkan tanpa kegagalan pemrosesan *data parsing*17.  
* **AC-07**: Fitur *Auto-Fix* harus dapat mengaplikasikan perubahan posisi atau warna ke kanvas Fabric.js dalam waktu ![Simbol 10][image10] milidetik dari aksi tindakan pengguna8.

## **Persyaratan Non-Fungsional, Keamanan, dan Manajemen Risiko**

### **Skalabilitas dan Keandalan**

Untuk menjaga performa aplikasi saat terjadi lonjakan beban kerja, pemrosesan kanvas statis dialihkan sepenuhnya ke peramban pengguna (*client-side execution*) memanfaatkan efisiensi HTML5 Canvas8. Sementara itu, beban pemrosesan video yang intensif diserahkan pada arsitektur *serverless* berbasis peristiwa (*event-driven serverless architecture*) yang dapat meningkatkan kapasitas server secara mandiri6.

### **Mekanisme Penanganan Kegagalan AI (Deterministic Fallback)**

Layanan kecerdasan buatan berbasis MLLM dapat mengalami variasi waktu respon (*latency*) atau gangguan konektivitas API10. Platform mengimplementasikan mekanisme *Deterministic Fallback*: apabila pemanggilan API MLLM mengalami *timeout* (melebihi 4 detik) atau mengembalikan format data yang tidak sesuai skema, sistem secara otomatis menonaktifkan kritik berbasis bahasa alami dan beralih menggunakan algoritma analisis lokal deterministik berbasis OpenCV dan Chroma.js9. Mekanisme ini memastikan alur kerja pengguna tetap berjalan tanpa hambatan teknis2.

### **Matriks Manajemen Risiko Produk**

| Area Risiko | Tingkat Dampak | Kategori Risiko | Strategi Mitigasi Teknikal |
| :---- | :---- | :---- | :---- |
| **Pergeseran Geometri AI (*Geometry Drift*)** | High | Kegagalan Algoritma | Memasang kunci koordinat (*layout locking*) pada lapisan logo dan *footer* agar tidak dapat diubah secara acak oleh rekomendasi AI23. |
| **Keterlambatan Render Video (*Rendering Latency*)** | Medium | Performa Infrastruktur | Menggunakan sistem antrean pekerjaan (*BullMQ*) berbasis Redis dan mendistribusikan proses render ke Remotion Lambda6. |
| **Interferensi Antarmuka Media Sosial** | High | Interaktivitas Konten | Menyediakan lapisan pratinjau transparan (*UI Overlay Template*) yang mensimulasikan tombol dan teks bawaan Instagram di atas kanvas editor. |
| **Pelanggaran Lisensi Font dan Aset** | Medium | Keamanan Hukum | Membatasi perpustakaan tipografi bawaan hanya pada koleksi font berlisensi *Open Font License* (OFL) dan mengisolasikan penyimpanan aset pengguna di Amazon S3. |

## **Rencana Tahapan Pengembangan (Roadmap)**

Pengembangan platform dilaksanakan melalui tiga fase berurutan untuk memvalidasi kelayakan teknis secara bertahap:

> 1. **Fase Pertama (MVP \- Core Engine)**: Fokus pada pembangunan modul ingesti aset, integrasi kanvas interaktif Fabric.js untuk Poster statis, dan penerapan algoritma pemeriksaan kontras warna WCAG deterministik8.  
> 2. **Fase Kedua (Video Automations & AI Critic Integration)**: Integrasi modul Remotion Lambda untuk generasi otomatis Instagram Reels, penggabungan MLLM API untuk menghasilkan laporan kritik desain terstruktur, serta implementasi fitur *Auto-Fix* berbasis skema JSON6.  
> 3. **Fase Ketiga (Optimization & Scale)**: Pengoptimalan kecepatan rendering video, penyempurnaan akurasi rekomendasi AI melalui teknik *few-shot prompting*, serta peluncuran fitur analitik performa template bagi pengguna enterprise2.

### **Karya yang dikutip**

> 1. FREE PRD Template \| Product Requirement Doc Template \- Miro, [https\://miro.com/templates/prd/](https://miro.com/templates/prd/)  
> 2. AI PRD Generator: Create Product Requirements Fast \- Miro, [https\://miro.com/ai/product-development/ai-prd/](https://miro.com/ai/product-development/ai-prd/)  
> 3. Free AI PRD Generator \- Template.net, [https\://www\.template.net/ai-prd-generator](https://www.template.net/ai-prd-generator)  
> 4. Modular Product Requirement Document Template \| Miroverse, [https\://miro.com/templates/modular-prd/](https://miro.com/templates/modular-prd/)  
> 5. Visualizationary: Automating Design Feedback for Visualization, [https\://arxiv.org/html/2409.13109v1](https://arxiv.org/html/2409.13109v1)  
> 6. Remotion Experts \| Hire Remotion freelancers, [https\://www\.remotion.dev/experts](https://www.remotion.dev/experts)  
> 7. Orchestrating LLMs with Specialized Models: A Survey on, [https\://www\.preprints.org/manuscript/202607.1041](https://www.preprints.org/manuscript/202607.1041)  
> 8. Creative vibecoding inspirations \- Scouts by Yutori, [https\://scouts.yutori.com/a021c47f-fb18-448b-88c5-51a1a17ba39a](https://scouts.yutori.com/a021c47f-fb18-448b-88c5-51a1a17ba39a)  
> 9. Design Critique MCP Server \- LobeHub, [https\://lobehub.com/pl/mcp/haasonsaas-design-critique-mcp](https://lobehub.com/pl/mcp/haasonsaas-design-critique-mcp)  
> 10. The AI you use for design feedback is guessing \| by Imran \- Medium, [https\://medium.com/design-bootcamp/the-ai-you-use-for-design-feedback-is-guessing-b4b9cfeaf7ee](https://medium.com/design-bootcamp/the-ai-you-use-for-design-feedback-is-guessing-b4b9cfeaf7ee)  
> 11. LLM Guided Multi Style Typography and Layout Generation via, [https\://openaccess.thecvf.com/content/CVPR2026F/papers/Fu\_LLM\_Guided\_Multi\_Style\_Typography\_and\_Layout\_Generation\_via\_Dynamic\_CVPRF\_2026\_paper.pdf](https://openaccess.thecvf.com/content/CVPR2026F/papers/Fu_LLM_Guided_Multi_Style_Typography_and_Layout_Generation_via_Dynamic_CVPRF_2026_paper.pdf)  
> 12. SpecifyUI: Supporting Iterative UI Design Intent Expression through, [https\://www\.researchgate.net/publication/395387833\_SpecifyUI\_Supporting\_Iterative\_UI\_Design\_Intent\_Expression\_through\_Structured\_Specifications\_and\_Generative\_AI](https://www.researchgate.net/publication/395387833_SpecifyUI_Supporting_Iterative_UI_Design_Intent_Expression_through_Structured_Specifications_and_Generative_AI)  
> 13. Free General Product Requirements Template to Edit Online, [https\://www\.template.net/edit-online/430170/general-product-requirements](https://www.template.net/edit-online/430170/general-product-requirements)  
> 14. Figma AI Design Generator: Web App and Figma Plugin \| UX Pilot, [https\://uxpilot.ai/figma-ai](https://uxpilot.ai/figma-ai)  
> 15. WebGen-V Bench: Structured Representation for Enhancing Visual, [https\://arxiv.org/html/2510.15306v1](https://arxiv.org/html/2510.15306v1)  
> 16. Get design feedback with AI (try this prompt) \- YouTube, [https\://www\.youtube.com/watch?v=vq0k8jTlyqk](https://www.youtube.com/watch?v=vq0k8jTlyqk)  
> 17. Context-Aware Workflow Decomposition for Automated Mobile UI, [https\://arxiv.org/html/2606.02208v1](https://arxiv.org/html/2606.02208v1)  
> 18. (PDF) LLM-as-Design-Critic: Aligning AI-Generated UI Feedback, [https\://www\.researchgate.net/publication/412824862\_LLM-as-Design-Critic\_Aligning\_AI-Generated\_UI\_Feedback\_with\_Human\_Graphic\_Design\_Judgment](https://www.researchgate.net/publication/412824862_LLM-as-Design-Critic_Aligning_AI-Generated_UI_Feedback_with_Human_Graphic_Design_Judgment)  
> 19. some-stars/README.md at main \- GitHub, [https\://github.com/rcy1314/some-stars/blob/main/README.md](https://github.com/rcy1314/some-stars/blob/main/README.md)  
> 20. public.bookmarks.md \- GitHub Gist, [https\://gist.github.com/HotCherryPie/0c758013d8b1b060fb71df5e53f488c3](https://gist.github.com/HotCherryPie/0c758013d8b1b060fb71df5e53f488c3)  
> 21. ComfyUI\_Simple\_Qwen3-VL-gguf/system\_prompts.json at main, [https\://github.com/KLL535/ComfyUI\_Simple\_Qwen3-VL-gguf/blob/main/system\_prompts.json](https://github.com/KLL535/ComfyUI_Simple_Qwen3-VL-gguf/blob/main/system_prompts.json)  
> 22. Exploring Multimodal LLM-Based Data Visualization Interpretation, [https\://dl.acm.org/doi/fullHtml/10.1145/3663548.3675660](https://dl.acm.org/doi/fullHtml/10.1145/3663548.3675660)  
> 23. Best AI Rendering Tools for Architects: 10 Compared (2026), [https\://maverickframe.com/blog/best-ai-rendering-tools/](https://maverickframe.com/blog/best-ai-rendering-tools/)  
> 24. LLM Tools for Design and Visual Content Creation \- Kalungi, [https\://www\.kalungi.com/blog/llm-tools-for-design-and-visual-content-creation-tips-best-practices-prompt-library](https://www.kalungi.com/blog/llm-tools-for-design-and-visual-content-creation-tips-best-practices-prompt-library)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAATCAYAAADLRLCEAAACFElEQVR4Xu2WzytlYRjHH6GIQjQSQsmUBWqKspStWFgoG4kyG/kDlCxmYSeZFGmaFUXNLCiZSXdnoVgqJT/Cxk7ZqMH32/Mczjnuvefc6R4/6nzq0733fe+9532f93mf9xWJiYl5R9TAYZjn7/DB/gqY42orguVm5IzCcdGHRkE+XIQJWOztekEVPIN38BxewWvYbkZOHAwXTMkW+AvOmNlMyR7RySUkXDCO4AU8ht9Ft9ib8NlcgXOw1tudEZwEnYe/JXwwfkrw916dBrgE10QDlAkshN9MpjcnmJDgSbqDUQoLvN1pYTbXm+4CnFU4QK7uBmz29aWCW2PC5MDCBoMnyabos5ZFfzMrWs/S1TT2/YU3Zqu3O3vkwi74R/R45OTSRf6T6BYrMUnYYHBSU/Jcs8rgnmhAaKrnsv2raACp89yswVNgAG7bKz8HwUFNww5fe9hgJIO/PTWrPT0RU2gyA3Zgr2hmhIXpeSBaa3icOp6IHpE/YNvTt1/CIE6Kd2UZjFvzi6s9MpievGtsmdwWmQTBgdlTKVpnHBvhrsn36YoiJ34Pu31tp+arZEYcDGMIrotevIKK4//AOpEwnZrBo3cBXppN1j4ER+R5DCyk+xJcQFP937thzOSV+gH+E71ZctWdwR+azi2TwWJd4f1kUPQEWxXvyZSMVP/34eHqc2X7JOILVDLqYH9IOyWarfTmPALAunHh+cCv9gAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAATCAYAAADLRLCEAAACQElEQVR4Xu2XPUgcQRTHn0QLiSCi+BEVNQHFKFqYNMYiCBYWooWFIEhQJCRICi1sLNIFOxEhEGMpFgZshIgJItooClZ+NEIExVIS0EZi8v8zb3Dc3K57X9Fif/Bj72Z272bezXszJxIREXGHZMBHajPM17aw5MAW+AQ+8PSllUH4Dj70diRILvwEx9ReuAO/al8QDFgfXBfz3Ae4IOa5255NCVEwHDiABjFfOq5yWSfKa/gTvlAJl/wlfK/v/aiDu7Be33NsU3BCjSfVkqZGnYOTsPxmdygG4JVeKXkOL+Bne5MPo3AL5jltDO6hWuS0/1eq4DScFxOgsPDX86bcEPwN2zztLnxuFq6KKaCWDniuNjntXriaK9W0raASMUt1ET719PnBwRSqPXAPvtV2PxiAVdUbjD9qu9PuwuB/h7/UxpvdqYNbWyv8BvvFTChoUiQTvlRZCFk8uTqyrm/5hzDB4OtYcDxv4Iya8mLLgfNXXdZr0ERugwXxTIKLYDLBSAvZKlfACuyU+A89nIg9ZNmJM9WO4DEs0zYvydaMlMGc41ljSWVaxBsEwuW5Idd5a3PXBuMUPta2WHA34dZa4LQNwx9qqdOeNqJgKK/gFzEHrzDFMQimGIO5LSYdbErYmsHzC4sr/QhP1GrnvgO9Eo6FO5nVb2x+n3fnPIObYlYatcdxbn3Feo8d/L5qg8bJjsA1MfWBz7N2uYGNhd/n3Qu48zAotEviPwjxpMnCWSuJpWvCVMDukPLveLKpdC/5C0YHfDVLCJ9+AAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAATCAYAAAAjxAWvAAAAqUlEQVR4XmNgGAWjYBQMR5AKxHlAzA3FIwKMSE8zArEeEK+H4k4gFkZRMQKAOhAvB+JJQCyLJjfsgSIQzwbi1QyQgBhRQBKIpwDxFiDWguJhD5iB2AmIdwNxEhSDyoFhCViBOAKId0FpEH/YAk4GSGzuA2J/BkhMD0sAqp9BdTUI72CAJOdh61kYGHGeTgDiNQyQBgoID9tCahSMRCAPxCFEYisoHrJZAAC7LxZ9TlRViQAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAATCAYAAAAeVmTJAAACQ0lEQVR4Xu2Vy6uNURjGXzlExyUUnZPBTi6JckQKA6MjipRSysDAgCSFgcgpkoGiXDuUEiUTuQxcwuDERAxE/AGGMqIMDMTz2+tZe69vX6KkY+Cp3/6+dfnWete73vfdEf/19zTf3BbnxfTqcEWbxaqyY5xYZBaLSeVgi2aINaJfjCn6Z4vHZq5YIV6IQTHWc3rNIXE90r51DYg7Yoc5ID77mTdh8hFzT2wVV8RFj6FtYsRwCL49IbaLy5EMumSeRzK0oVE3YoK4H+lD3AyIj7+JlW7j0tdmlvsmigdil9sHo2oEYmyZ39FOg8ENYQRe+CgWGHRY/BDrI53oqrhlejwHnRNPI93z/mg3Ykgs9DvxdsE0YiGLjvFFmxM+Eu/ETDE5kvuumVKc/oPoi+S1lwZv4VU8ynrANXAFlVgohSHzzHHxPlKsIDZgo25GfBFLInlst3ki7orlntd2BZ1EPm8yuJVFVnvsV0Z8jeq9typfAwfNKXpKvI30fVftEd8jBeSfGME1nBU1t5kPeJvawYHrLuTuWovTxkiBeUNMid+LiU4i5bf4fZp4ZVgfzeGHYCIVc4QDykaQDbiR7CCVgYzKolaMRPsh0FJxOpqZkD0K2Yi68f+EEfxPfBJnIuV/rgHEBEZQGdE68caUxYpUZm6rMIqUrBV9Xa+DmNgnHkZKIchlmxKdT8Fz2NyMZPxJv0/1nFJ7oxkLWezFYeGo+/Ih62KhtQWdFmYRqIkNftIulWvNsehQFSOtCwT4s2gaM7r6CY5+jdqeo0vEAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAATCAYAAAAeVmTJAAACNUlEQVR4Xu2VT4hOYRTGj6SIyJ9IKZNQshJNsaH8y8JmJs2UBWVBFooSFqaRLBRFLLBQ7GxkIzWz+WJjzGaaDUtmMYpYseb5feec7773znxjJbPw1K/vu+973vc+9z3n3Gv2X39PW4Pn4p5YVZ+uqU/syYvlYmk119YCsU4simt+1wSlVpivRxvESLBZ9Iq34qBYGDHcB66Ip1btb5fEL/ElmBI/xKMiaKf4GTBHDLHvxcaIOS5awTLzB7khToiH5oYeBG/MjXY0b0x8N98YCO636ggRJj4HxHwQ16xKBWKfVoAJdMZ8bep0gOGaWHy0OdgQG1Fo0E0XbKaJq2Jb/N8u7gedWkilCSaAiuYoS5UmmCOmudFu8S6gqFebp2NJQBpIQS0NKY5nVDwLnogxsbeI4WleB7Qf9ULaLlplBnNnA/Z7IXbF3KwpKHVADDTGWPDV/AjRWvMagLzpJjFtnve5lGlgXbboLTFpnoWuym6YK4i8t4KsgaZIw13RE9fsB9fNC586agddFvsjKJUmSA2iZs4HeRJp4pNYH2NNnRLH4v9KMR5kI3CanZu9FIuDchzXebNvQVb7n05ih7htlWmMYhjSRNv8vDBBGz02b6lSJ61emBTkoSC1xfzlNVthYoqW7CnGuqYDHTb/6NARMCQ+iiMZYO74VUAxkesJcdNmvi/QOatqIUUL3wmGY2ywM2veNvmk+6xKSymqGUgVT9I8PcTpQNnKpfjqAgXPO2e4Nvuv9BsRM49fxI9iIQAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAUCAYAAAAz30VQAAAC2UlEQVR4Xu2WS6hNURjHP3lE3o88Qq5iQIrylrjJM0mhPAcmQnmlUKSOJISJAZJEwgQlBpKiGBCJ8igGYmDGQBkq/9/91rp7n93Z52zn6tbtnn/9unevvdbZ6/+tb61vmTXUUEPtoO7ioLgvbgaa0h2C+ovzYmT2RVY9RJdsYxvVW2wSFwO7Rb+yHv7NmeJs4JxYLrqm+qwS90QvMS7wTpwRM8QYsVV8EqvDmKrqVGbni7tis/kkoS1iAi/FetEtsFK8Cu+itoiHYlAAQwRmvyXBvySuhv/jbx0SI8R4MVcsEcfCu0KKUb4VOC4Gl/UoJj7IvsLswFQ7AXwkSuF5mPhovnJpTRdfxKTwjNFoNuqouVnEHMmIeubaqrHmUWbiE614mg8R78UT0af8Vcukn4q+Ypn4JaaW9XATX81TE5UsMUvw4LR58AjsCfNF+i8iYvvEA7HAyvdTJeWZJVjXzY1gaK/4bflmSUtE2j8z/zbpDTEb+LvHii9EYRHR2+Ky+YGWp5jGcQWjGE9qfzc3cMCqm02nLgfbCjE5gLkmccE8oCzAQvNAxPSuSww+Ja5Z8XTGzFux1nwiwEn505KV/RezWXGQYZSTmflgklpMVlFrRwVqisGAMQxitJ5oMeawJWVltrhhycHFnqxmlsnnaaclqcwl4o35wYaWmgcZckX02RfUNNhl9Zcg0m6e+QpExTQuhWdKBmZJv7QmiB9iY6YdUVfhpPnNChGsb+FvfN4WqKjF4o4lBb3WIVRLpOgf0ZxqW2Se2rHOcr17Lna09nCxMhxwozPt9KfEwNBUO8H5bIlZgrg9UFGdyizmihw8RUWqPRYbzEsMvBBT0p2kaeKDJXusWbw2D3pazO2IeT3N1lS2Cre/deb9+BYXkngpaRexEmQMhiDusax6mpuM8JzVLPOViodnVsPFFfN6zF7P69ciUmFNQeZYlR/qCKIwc+QXYUAY0+H0Fyw3jjawY2+8AAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAVCAYAAAAnzezqAAABE0lEQVR4XmNgGAWjYBgDZiD2BuJpQDwJiF2gYiBMc8AKxJ1A7APEglD6PRDPgmKQPMmAEYi1oDiaAb9PbID4FRCnIYk1APE/KAaFBtEA5FpfIN4OxMlQzI2iAhM4APFfIO5FEgOZ8R+Ky5HEcQKQJfkMEItBcYnPx9gALwOqHpClsBDwQBLHCQbEAZJQ3A3Ea4BYjwES95QCMSC+woAnEaoD8WIGiMUgDHIEtQDIshlAPJ8BEqpY048yA20cALJ8ChBXQ9kEAXIUgBwEynLkRgEo/ouBOI4BYYYnFEfCFOEDlCRCkIVlQDwbiEOgGJR990ExqJwgGpBTDoBSOSzPI+PnUKyEUEoYDLgDYICUongUEA0AseM+metHRLwAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAVCAYAAAAw73wjAAABvklEQVR4Xu3VTygFURQG8CMU+ReJlCIWIpEslJVSStgpykYpWShssLG0kI0QJRtJSspKLCRFNtY2SlJKlJSy5vu65z4z00xmJq+emq9+vffmzrtz5s69d0SSJEmS8cmCDliFDRiEfNcZJsUwBVuwAFXu5vRnGlagEMrgEs6gRDEVcA1DYm6sE66gRsUKO2qCEZXtbk6FhdEFvEGjHp+DL+hVzKSYGyjS37zGHqwr/g6dXBiAExiDAvVbumFGzP+ZbfiEdsU+OMI72m7DG7pV5Z4237Ajzh0W2CfBIxgmrfACs2JGiSrhXvwLfVZ1njbfZHShXHG0DIfQIhHniScNcA6vsChm7trwOo/iXyiniJ0mrrDDXTEF0l9vEXwaa3AnPys6VqH1kt5CGS5Irnruq8SFwgXjV+iTqva0peJ89Cyc21HUR9+m3uEI8vS4LfRYcRpwevG7PYfhTdyoUsfxwMRdTHb7+RCzF+bo8VExhU4oZljMqHJhMXxznYoZVYqUqPsoC6N5Mf/hy2EcHmBJTH92b+XnJuxDs5gneSDut1fo/JtCbThXw7xCneE87IIeCb4w+62Ffv2MuiaSxMo3Nzhinl45L8wAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAUCAYAAADFlsDIAAACK0lEQVR4Xu2XzUtUURjG36ig6EOxhURBYZISlhv/gBZSQUTSBxi6a1OgtIp2umoViQvBjS5CBKEiWqU7aeHChVCb2gRjKEIbwaUQ+Ty873HO3GbGc+89EMH5wY+Zufe9HOeZ855zFEkkEolEPfrgDDyRvZHhJHwCe+BZeB4+NG94dTE5DZ/C1uyNf0UKK5AzcBUui4bRDAa0Dv94LpgtXl1ZjsHncAVui47JsaNwCF6BQ/CwGcIR+BJWJDysD3AQ3oHttbejwe9zyl5fSKSwjor+0Z/gYzm4jbLcg6PwjYSHxdqD6mJSOiyG8kw0pNsSPpMcF8wJeFzyhTUPH4m23qzojKbN4HNL5mvRGR1KobBY/Mp8B6+JTtO8cDay9WinXQsNi/ffw5uiY3fDH+Z9ry4Lf5iK+VZ0TQolV1hdcE40JD4Q9FATuN64HcwRGhYD8ludnznT6BfRzSI2ucK6JPHCYvCLom1EH5if4Xc4DM/tV/8Nx74uOjsdDJruwF7veixyheXw25DhcZ3I24Zt8K5UQ6IMiEGFhMWzGI8Lt7xrLqwt2OFdj0WhsHzKLvA+bL1l07UhF+BJuGby8ElG4LhUx2PbuRoG2Wjh5vM8y9EpaVxXjxRW7e2mlA7LUfacxX9dNuBvk+/7Rb/MNNw0L1s9T+k8LoyJbhQfRXc3yhZvBMP6ZobuhjzW/IS7oq3/C36FV83CcO0qcoIvAsdieAPwon3Ou3YmEv8JezgafPVSnexjAAAAAElFTkSuQmCC>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAUCAYAAAAtFnXjAAACOklEQVR4Xu2WPWhUQRSFT4iRRCUGEUJAEaIihqCFfygWW4gkiBaiCNoIorEQDRGUBCwsQkC7ICmCjYR0go0hiaRY1MLKTq1CYmVlkaA2FnqOd4a9z81bd9/KwoY98PFg9s4w586dOws01FBD9aATgYtkB+kivWSQdLg4qY1cJpPkEdmX/PmPmsgxMk4myBnSnIiogdalqfuBX44V0u9iZEY8J8OwTe4hb8lRFyddJ6/INtgcJeAezGxV0gI95EqgVKaiqQfkAjlMWhIRQF9gEXaaUSNkDrb5zsAnct7FHCFLsNPPJG3mLJkl18jmQClFU5qXpqeBPNnixjXnK9kPO1mxSg65GJXzZzLgxsqSNn4HZqbSGo6mbpKH5CW5Acu+pLUXAnkUm/pJTpKhwHesbWrUjaVKweIxrNYPIFvdamNimrTDEjIGM7EVZiLv+NuU7qC+MTlppp65sSKp40zBzAhNqkYbA/4e6R58g5VwTUztxv8zpVNR6Yhdblyb0uZ0j1rJTCCPYlM/YEnQnRFpptRU/ilffjKpbldp+R2EXWwxTzaF8Wgq3gN9xQeyPYxJMvGFdKOQHM075WLURNRM1IUrUtZGoRYcT2GvG7+KZMaPB5Tx2JqVwCew09wAu3/iHbkVYiQ9BUrGTjdWltalqags75SSIF7ASkRteZmcQ6Gc9RV3yWuY2dvkDZKPsaTH+yO5RHLkPWz9qqUNlPuPIkrmT8M2ouaQJp2uEqe7krau5ucCpdZqqG70G2BEgOTEAVjtAAAAAElFTkSuQmCC>