'use client';

import { Download } from 'lucide-react';

export default function ExportButton({ history }) {
  const exportCSV = () => {
    if (!history || history.length === 0) return;

    const headers = [
      'Tanggal',
      'Marketplace',
      'Judul Input',
      'Penulis',
      'Subjek',
      'SEO Title',
      'SEO Title Length',
      'SEO Score',
      'Deskripsi',
      'Deskripsi Length',
      'Tags (All)',
      'Tags Broad',
      'Tags Medium',
      'Tags Long-tail',
      'Tags Brand',
    ];

    const rows = history.map((item) => {
      const r = item.result || item;
      const input = item.input || {};
      return [
        item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '',
        item.marketplace || 'shopee',
        input.title || '',
        input.author || '',
        input.subject || '',
        r.seoTitle || '',
        r.seoTitleLength || r.seoTitle?.length || '',
        r.seoScore || '',
        (r.optimizedDescription || '').replace(/"/g, '""'),
        r.descriptionLength || r.optimizedDescription?.length || '',
        (r.tags || []).join(', '),
        (r.tagBreakdown?.broad || []).join(', '),
        (r.tagBreakdown?.medium || []).join(', '),
        (r.tagBreakdown?.longTail || []).join(', '),
        (r.tagBreakdown?.brand || []).join(', '),
      ];
    });

    // BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    const csvContent =
      BOM +
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deeppro-seo-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!history || history.length === 0) return null;

  return (
    <button
      onClick={exportCSV}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-100 text-ink-600 rounded-lg text-[10px] font-bold hover:bg-ink-200 transition-colors uppercase tracking-wider"
    >
      <Download size={12} /> Export CSV
    </button>
  );
}
