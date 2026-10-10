# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# Proyek: SWARA - Desktop Web Board Game & Edukasi Sentuhan Aman

---

## 1. Executive Summary & Visi Produk
**SWARA** adalah aplikasi desktop web yang mengadaptasi permainan papan tradisional Indonesia **Surakarta** (Catur Jawa / Dam-Daman Melingkar) yang diintegrasikan secara mendalam dengan **Pendidikan Seksualitas & Batasan Diri (Bodily Autonomy & Safe/Unsafe Touch Awareness)** untuk anak-anak dan remaja (usia 8–15 tahun), guru, serta orang tua.

* **Visi**: Mengubah edukasi pencegahan kekerasan seksual dan batasan tubuh yang seringkali dianggap tabu atau kaku menjadi pengalaman bermain interaktif yang menyenangkan, mendidik, dan membangun keberanian anak untuk bersuara (*SWARA / Suara*).
* **Target Platform**: Desktop Web (Resolusi 1280px - 1920px+).
* **Aesthetic Theme**: **Pastel Modern Soft Neo-Morphism** (Warna-warna lembut, ramah, tidak menakutkan, transisi 60 FPS, 3D card flip).

---

## 2. Fitur & Spesifikasi Fungsional

### A. Core Surakarta Game Engine
1. **Grid & Board Representation**:
   - Papan $6 \times 6$ titik (36 intersection points: $(r, c)$ dengan $r, c \in [0..5]$).
   - 8 Busur Lingkaran Sudut (2 lintasan konsentris di tiap 4 sudut):
     - **Top-Left Outer**: $(0,1) \leftrightarrow (1,0)$
     - **Top-Left Inner**: $(0,2) \leftrightarrow (2,0)$
     - **Top-Right Outer**: $(0,4) \leftrightarrow (1,5)$
     - **Top-Right Inner**: $(0,3) \leftrightarrow (2,5)$
     - **Bottom-Left Outer**: $(5,1) \leftrightarrow (4,0)$
     - **Bottom-Left Inner**: $(5,2) \leftrightarrow (3,0)$
     - **Bottom-Right Outer**: $(5,4) \leftrightarrow (4,5)$
     - **Bottom-Right Inner**: $(5,3) \leftrightarrow (3,5)$
2. **Setup Awal**:
   - **Pemain 1 (Biru Pastel)**: 12 pion di baris index 0 dan 1.
   - **Pemain 2 (Peach/Coral Pastel)**: 12 pion di baris index 4 dan 5.
   - Baris index 2 dan 3 kosong di awal permainan.
3. **Mekanika Langkah (Movement Mechanics)**:
   - **Langkah Reguler**: Bergerak 1 langkah ke segala arah (horizontal, vertikal, diagonal) ke titik kosong yang bertetangga.
   - **Langkah Menyerang (Capture Move)**:
     - Pion meluncur lurus (horizontal atau vertikal) menuju ujung papan dan memasuki lintasan lingkaran sudut.
     - **Wajib melewati minimal 1 lintasan lingkaran** (loop corner).
     - Selama menempuh jalur sebelum dan di dalam lingkaran, tidak boleh terhalang pion lain.
     - Setelah keluar dari lingkaran, pion terus meluncur sampai mendarat tepat di atas pion lawan untuk memakannya.
4. **Kondisi Selesai (Win Conditions)**:
   - Deck kartu edukasi habis (10 kartu selesai dimainkan).
   - Salah satu pemain kehilangan seluruh 12 pionnya.
   - Salah satu pemain tidak memiliki langkah valid (*stalemate*).
   - **Pemenang**: Pemain dengan akumulasi **Bintang Terbanyak**. Jika bintang seri, pemain dengan sisa pion terbanyak menang.

---

### B. Modul Kartu Edukasi (Interactive Card System)
* **Trigger**: Muncul seketika setelah seorang pemain berhasil memakan pion lawan.
* **10 Skenario Edukasi**:
  1. *Rahasia yang Mencurigakan/Menakutkan* (Katakan "Aku tidak mau merahasiakan ini" & lapor).
  2. *Body Shaming & Komentar Fisik* (Tegas: "Tolong jangan komentari tubuh saya").
  3. *Dicubit Pipi dengan Kencang/Sengaja* (Sentuhan Tidak Aman -> Tolak tegas & jaga jarak).
  4. *Dipeluk Tanpa Izin* (Pelanggaran Konsen -> Hak menolak: "Saya tidak mau dipeluk").
  5. *Berjabat Tangan Wajar* (Sentuhan Aman, namun tetap berhak menolak jika tidak nyaman).
  6. *Dielus Kepala Wajar* (Sentuhan Kasih Sayang Wajar jika nyaman, hak menolak jika tidak mau).
  7. *Ditunjukkan Foto/Video Tidak Senonoh* (Pelecehan Visual -> Tolak, tutup, lapor).
  8. *Dirangkul Tiba-Tiba* (Pelanggaran Batasan -> "Jangan rangkul saya").
  9. *Mengobrol Jarak Wajar* (Interaksi Aman -> Waspada jika melanggar batas).
  10. *Diperintah Melanggar Batas Tubuh* (Penyalahgunaan Otoritas -> Berani berkata "TIDAK").
* **Card Interaction Loop**:
  - **Fase 1 (Kartu Biru)**: Tampil gambar skenario + teks pertanyaan + 3 opsi respon.
  - **Fase 2 (Jawaban Pemain)**: Pemain memilih salah satu respon.
  - **Fase 3 (Kartu Kuning - 3D Flip)**: Kartu berputar 180° menampilkan penjelasan kebenaran jawaban & nilai edukasi.
  - **Fase 4 (Reward)**: $+4$ Bintang jika benar disertai animasi partikel bintang.

---

### C. Game Modes
1. **2 Player Local (Pass & Play)**: Mode 2 pemain bermain bergantian di 1 komputer.
2. **VS Bot AI (Single Player)**: Pemain bermain melawan bot komputer cerdas yang mengevaluasi peluang memakan pion dan langkah defensif.
3. **Tutorial / Panduan Interaktif**: Panduan visual lengkap mengenai aturan main Surakarta dan cara mendapatkan bintang.

---

## 3. Style Guide (Pastel Theme)

### Color Tokens
* **Background Utama**: `#F8F9FE` (Cloud Milk)
* **Card & Panel Surface**: `#FFFFFF` (Pure White dengan soft glassmorphism & shadow)
* **Player 1 (Pastel Sky Blue)**: `#7BBDF5` (Pion & Aksen Biru)
* **Player 1 Darker Accent**: `#4FA3E3`
* **Player 2 (Pastel Coral Peach)**: `#FF9EAA` (Pion & Aksen Peach)
* **Player 2 Darker Accent**: `#F47B89`
* **Kartu Kasus (Biru)**: `#E3F2FD` dengan border `#7BBDF5`
* **Kartu Edukasi (Kuning)**: `#FFF8E1` dengan border `#FFE082`
* **Success / Safe**: `#A7F3D0` (Mint Pastel)
* **Warning / Alert**: `#FECDD3` (Rose Pastel)
* **Star Gold**: `#FBBF24` (Golden Star)
* **Text Dark**: `#1E293B` (Slate Primary)
* **Text Muted**: `#64748B` (Slate Secondary)
* **Board Canvas**: `#FDFBF7`
* **Grid Lines**: `#CBD5E1`

### Typography
* **Family**: `'Plus Jakarta Sans'`, `'Nunito'`, sans-serif
* **Header**: 28px - 32px (Bold 700 / 800)
* **Subheader**: 18px - 20px (SemiBold 600)
* **Body / Text**: 14px - 16px (Regular 400 & Medium 500)

---

## 4. Engineering Architecture & Test Plan

### Tech Stack
* **Vite + Vanilla Modern ES6 Modules** (Fast, zero-overhead, modular, no runtime framework bloat).
* **Dynamic Scalable Vector Graphics (SVG)** untuk rendering papan Surakarta matematis & tajam di semua DPI.
* **Web Audio API Sound Synthesizer** (Menghasilkan efek suara interaktif tanpa delay network).
* **Vitest** untuk Unit Testing & Integration Testing.

### Engineering Test Suites (Vitest)
1. `SurakartaBoard.test.js`:
   - Inisialisasi posisi pion 12 vs 12.
   - Pengecekan bounds grid $(0..5, 0..5)$.
   - Pergerakan pion 1 langkah orthogonal & diagonal ke titik kosong.
   - Penolakan langkah ilegal (ke titik berisi pion, langkah $>1$ tanpa loop).
2. `SurakartaRules.test.js`:
   - Validasi jalur loop capture (Corner loops top-left, top-right, bottom-left, bottom-right).
   - Deteksi rintangan: pion terhalang tidak boleh memakan.
   - Validasi multi-loop capture pathfinding.
   - Deteksi kondisi game over (pion habis, stalemate).
3. `cardsData.test.js`:
   - Validasi integritas 10 kartu (id unik, opsi benar valid, teks penjelasan, aset gambar).
   - Pengambilan kartu acak tanpa duplikasi.
4. `GameState.test.js`:
   - Pergantian giliran (*turn switching*).
   - Penghitungan skor bintang dan pion tersisa.
   - Triggering status modal kartu saat capture.
5. `BotAI.test.js`:
   - Evaluasi langkah terbaik (memprioritaskan memakan pion lawan via loop, lalu langkah aman).

---

## 5. Definition of Done (DoD)
- [x] PRD & Style Guide terdokumentasi lengkap.
- [ ] Setup proyek Vite + Vitest.
- [ ] Semua unit test pada `SurakartaBoard`, `SurakartaRules`, `cardsData`, `GameState`, dan `BotAI` lulus 100% tanpa error.
- [ ] UI terpasang dengan tema pastel modern, SVG board tajam, animasi 3D flip kartu, dan Web Audio SFX.
- [ ] Testing interaktif desktop web via Browser Agent berjalan lancar (Pass & Play, VS AI, Tutorial, Responsif, 0 error console).
