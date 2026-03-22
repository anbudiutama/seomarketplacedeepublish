# Deeppro SEO v2.0

**Tools optimasi SEO marketplace untuk tim Penerbit Deepublish.**  
Optimalkan judul, deskripsi, dan tags buku di Shopee, Tokopedia, dan Lazada menggunakan AI (Claude).

---

## Fitur

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1 | **Prompt presisi** | Few-shot prompting dengan contoh output, aturan spesifik per marketplace |
| 2 | **Validasi input** | Client + server-side validation, dropdown bidang ilmu |
| 3 | **Multi-marketplace** | Shopee, Tokopedia, Lazada — aturan SEO otomatis menyesuaikan |
| 4 | **Score breakdown** | 7 kriteria penilaian transparan, bukan skor acak |
| 5 | **Inline editing** | Edit judul dan deskripsi langsung di hasil, tanpa copy ke tempat lain |
| 6 | **Character counter** | Real-time counter per marketplace (Shopee 120, Tokopedia 70, dst) |
| 7 | **Bulk processing** | Upload CSV hingga 20 buku sekaligus |
| 8 | **Export CSV** | Download riwayat optimasi ke CSV untuk serah terima tim |

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **AI**: Anthropic Claude API (server-side, API key aman)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

---

## Deployment Guide

### 1. Supabase Setup

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → paste isi file `supabase-migration.sql` → Run
3. Catat **Project URL** dan **anon key** dari Settings > API

### 2. Anthropic API Key

1. Dapatkan API key di [console.anthropic.com](https://console.anthropic.com)
2. Simpan key — akan digunakan sebagai environment variable

### 3. Deploy ke Vercel

```bash
# Clone / upload project
git init
git add .
git commit -m "Deeppro SEO v2.0"

# Deploy
npx vercel

# Atau connect repo GitHub di vercel.com
```

### 4. Environment Variables (di Vercel Dashboard)

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxxxx` |

### 5. Custom Domain (Opsional)

Di Vercel Dashboard → Settings → Domains → tambahkan domain seperti `seo.deepublish.co.id`

---

## Penggunaan

### Mode Satu Buku
1. Pilih marketplace (Shopee/Tokopedia/Lazada)
2. Isi judul buku dan bidang ilmu (wajib)
3. Isi profil penulis dan resensi (opsional tapi meningkatkan kualitas)
4. Klik **Optimasi Strategis**
5. Review hasil → edit inline jika perlu → copy

### Mode Bulk CSV
1. Klik tab **Bulk CSV**
2. Upload file CSV dengan kolom: `title`, `subject`, `author` (opsional), `authorBio` (opsional), `bookSummary` (opsional)
3. Lihat file `sample-bulk.csv` sebagai contoh format
4. Klik **Proses** — maksimal 20 buku per batch
5. Review dan export hasil

### Export
- Klik **Export CSV** di panel Riwayat untuk download semua data optimasi

---

## Struktur Project

```
deeppro-seo/
├── app/
│   ├── api/
│   │   ├── generate/route.js        # API: single book
│   │   └── generate-bulk/route.js   # API: bulk CSV
│   ├── globals.css
│   ├── layout.js
│   └── page.js                      # Main UI
├── components/
│   ├── BulkUpload.jsx               # CSV upload & preview
│   ├── CharCounter.jsx              # Character counter
│   ├── ExportButton.jsx             # CSV export
│   ├── ResultCard.jsx               # Result display + inline edit
│   ├── ScoreBreakdown.jsx           # Score visualization
│   └── TagBreakdown.jsx             # Categorized tags
├── lib/
│   ├── prompts.js                   # Prompt engine + marketplace rules
│   └── supabase.js                  # DB client
├── sample-bulk.csv                  # Contoh file bulk upload
├── supabase-migration.sql           # Database schema
├── vercel.json                      # Vercel config
└── package.json
```

---

## Catatan Keamanan

- **API key Anthropic** disimpan di server (environment variable), TIDAK pernah terexpose ke browser
- **Supabase anon key** aman untuk client-side (hanya bisa akses sesuai RLS policy)
- Untuk membatasi akses per karyawan, tambahkan Supabase Auth + RLS policy per user

---

© 2025 Deepublish Ecosystem
