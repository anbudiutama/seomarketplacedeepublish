import './globals.css';

export const metadata = {
  title: 'Deeppro SEO — Optimasi Listing Marketplace Buku',
  description: 'Tools SEO untuk tim Penerbit Deepublish. Optimalkan judul, deskripsi, dan tags buku di Shopee, Tokopedia, dan Lazada.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-ink-50 text-ink-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
