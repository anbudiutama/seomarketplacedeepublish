import './globals.css';

export const metadata = {
  title: 'Deeppro SEO — Optimasi Listing Marketplace Buku',
  description: 'Tools SEO untuk tim Penerbit Deepublish. Optimalkan judul, deskripsi, dan tags buku di Shopee, Tokopedia, dan Lazada.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,700;1,9..40,900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-ink-50 text-ink-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
