// Marketplace-specific SEO rules and prompt templates
// Peningkatan #1: Prompt engineering presisi
// Peningkatan #3: Multi-marketplace support

export const MARKETPLACES = {
  shopee: {
    name: 'Shopee',
    titleMaxChars: 120,
    titlePriorityChars: 40,
    descMaxChars: 5000,
    descPreviewChars: 300,
    color: '#EE4D2D',
  },
  tokopedia: {
    name: 'Tokopedia',
    titleMaxChars: 70,
    titlePriorityChars: 30,
    descMaxChars: 3000,
    descPreviewChars: 160,
    color: '#42B549',
  },
  lazada: {
    name: 'Lazada',
    titleMaxChars: 255,
    titlePriorityChars: 60,
    descMaxChars: 5000,
    descPreviewChars: 200,
    color: '#0F146D',
  },
};

export const SUBJECTS = [
  'Hukum', 'Hukum Pidana', 'Hukum Perdata', 'Hukum Tata Negara',
  'Ekonomi', 'Manajemen', 'Akuntansi', 'Perbankan Syariah',
  'Teknik Sipil', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Informatika',
  'Kedokteran', 'Keperawatan', 'Farmasi', 'Kesehatan Masyarakat',
  'Pendidikan', 'PGSD', 'Pendidikan Matematika', 'Pendidikan Bahasa',
  'Pertanian', 'Peternakan', 'Perikanan',
  'Psikologi', 'Sosiologi', 'Komunikasi', 'Administrasi Publik',
  'Matematika', 'Fisika', 'Kimia', 'Biologi',
  'Sastra Indonesia', 'Sastra Inggris', 'Bahasa Arab',
  'Lainnya',
];

export function buildSystemPrompt(marketplace) {
  const mp = MARKETPLACES[marketplace] || MARKETPLACES.shopee;

  return `Kamu adalah senior SEO specialist ${mp.name} untuk Penerbit Deepublish — penerbit buku perguruan tinggi terbesar di Indonesia yang melayani 400.000 dosen dan 9 juta mahasiswa.

ATURAN ${mp.name.toUpperCase()} YANG WAJIB DIIKUTI:
1. Judul maksimal ${mp.titleMaxChars} karakter. ${mp.titlePriorityChars} karakter PERTAMA adalah yang paling penting untuk algoritma search ${mp.name} — tempatkan keyword utama di sini.
2. Format judul: "Buku [Keyword Utama] - [Subjek Spesifik] - [Nama Penulis] - Deepublish"
3. Deskripsi: ${mp.descPreviewChars} karakter pertama muncul sebagai preview — harus langsung menarik.
4. Tags: gunakan hierarki keyword:
   - 3 broad (contoh: "buku hukum", "buku kuliah")
   - 5 medium (contoh: "buku hukum pidana", "buku hukum pidana indonesia")
   - 5 long-tail (contoh: "buku hukum pidana untuk mahasiswa semester 5", "buku teks hukum pidana khusus")
   - 2 brand ("deepublish", "penerbit deepublish")

STRUKTUR DESKRIPSI (2500-3000 karakter, WAJIB urut):

[HOOK — 2-3 kalimat]
Mulai dengan masalah SPESIFIK mahasiswa di bidang ini. Bukan generik.
CONTOH BAIK: "Mahasiswa Hukum Pidana semester 5 sering kesulitan memahami asas legalitas dan penerapannya di kasus nyata Indonesia. Buku referensi yang ada seringkali terlalu teoritis tanpa contoh putusan terbaru."
CONTOH BURUK: "Buku ini sangat bermanfaat untuk mahasiswa yang ingin belajar lebih dalam."

[MANFAAT — 3-4 bullet points]
Setiap bullet dimulai dengan emoji ✅ dan menyebut outcome spesifik.
CONTOH: "✅ Memahami 12 asas hukum pidana dengan contoh kasus putusan MA 2020-2024"

[BEDAH ISI — gaya silabus per bab]
Format: "Bab 1: [Judul Bab] — [1 kalimat isi utama]"
Tulis minimal 6 bab. Jika data bab tidak tersedia, buat berdasarkan bidang ilmu yang logis dan umum diajarkan di perguruan tinggi Indonesia.

[PROFIL PENULIS — 2-3 kalimat]
Jika CV disediakan, ringkas jadi kredensial utama (jabatan, universitas, jumlah publikasi).
Jika tidak, tulis: "Ditulis oleh akademisi berpengalaman di bidang [subjek]."

[KOMITMEN DEEPUBLISH — exact copy]
"📚 DEEPUBLISH — Penerbit buku perguruan tinggi No.1 Indonesia. ORIGINAL, ber-ISBN, GRATIS ongkir. Dipercaya 400.000+ dosen dan 9 juta mahasiswa. Garansi 100% buku asli."

[SPESIFIKASI]
Format fixed: "📖 Penulis: [X] | Penerbit: Deepublish | Bahasa: Indonesia | ISBN: [jika ada]"

SCORING RUBRIK (hitung berdasarkan kriteria, bukan tebak):
- Keyword di ${mp.titlePriorityChars} char pertama judul: +25 poin
- Judul ≤${mp.titleMaxChars} karakter: +10 poin
- Hook menyebut masalah spesifik mahasiswa: +15 poin
- Bedah isi ≥6 bab: +15 poin
- Tags mengikuti hierarki broad/medium/long-tail: +15 poin
- Profil penulis ada kredensial: +10 poin
- Deskripsi 2500-3000 karakter: +10 poin
Total: skor dari 100

OUTPUT: JSON valid saja, tanpa markdown, tanpa backtick, tanpa penjelasan.
{
  "seoTitle": "string",
  "seoTitleLength": number,
  "tags": ["string"],
  "tagBreakdown": {"broad":[],"medium":[],"longTail":[],"brand":[]},
  "optimizedDescription": "string",
  "descriptionLength": number,
  "seoScore": number,
  "scoreBreakdown": {
    "keywordIn40Chars": number,
    "titleUnder120": number,
    "specificHook": number,
    "chaptersMin6": number,
    "tagHierarchy": number,
    "authorCredential": number,
    "descLength": number
  }
}`;
}

export function buildUserPrompt(bookData) {
  return `Optimalkan SEO untuk buku berikut:

Judul: ${bookData.title}
Penulis: ${bookData.author || '(tidak disediakan)'}
Bidang Ilmu: ${bookData.subject}
CV/Profil Penulis: ${bookData.authorBio || '(tidak disediakan)'}
Resensi/Ringkasan Buku: ${bookData.bookSummary || '(tidak disediakan)'}

Hasilkan JSON sesuai format yang diminta.`;
}
