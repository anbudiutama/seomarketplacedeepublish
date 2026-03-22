'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function BulkUpload({ marketplace, onResults }) {
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setParsing(true);

    try {
      const Papa = (await import('papaparse')).default;
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data;
          
          // Validate required columns
          const required = ['title', 'subject'];
          const headers = Object.keys(rows[0] || {});
          const missing = required.filter((r) => !headers.includes(r));

          if (missing.length > 0) {
            setError(`Kolom wajib tidak ditemukan: ${missing.join(', ')}. Pastikan CSV punya kolom: title, subject, author (opsional), authorBio (opsional), bookSummary (opsional)`);
            setParsing(false);
            return;
          }

          if (rows.length > 20) {
            setError(`Maksimal 20 buku per batch. File ini berisi ${rows.length} baris.`);
            setParsing(false);
            return;
          }

          setPreview(rows);
          setParsing(false);
        },
        error: (err) => {
          setError(`Gagal membaca CSV: ${err.message}`);
          setParsing(false);
        },
      });
    } catch {
      setError('Gagal memproses file. Pastikan format CSV valid.');
      setParsing(false);
    }
  };

  const startBulk = async () => {
    if (!preview || preview.length === 0) return;

    setGenerating(true);
    setProgress({ current: 0, total: preview.length });
    setError(null);

    try {
      const response = await fetch('/api/generate-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ books: preview, marketplace }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Bulk generation failed');
        setGenerating(false);
        return;
      }

      onResults(data.results);
      setPreview(null);
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-ink-200 rounded-2xl p-6 text-center cursor-pointer hover:border-deep-300 hover:bg-deep-50/50 transition-all group"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
        />
        <Upload
          size={28}
          className="mx-auto mb-2 text-ink-300 group-hover:text-deep-500 transition-colors"
        />
        <p className="text-xs font-bold text-ink-500">
          Upload CSV (maks 20 buku)
        </p>
        <p className="text-[10px] text-ink-400 mt-1">
          Kolom wajib: <code className="bg-ink-100 px-1 rounded">title</code>,{' '}
          <code className="bg-ink-100 px-1 rounded">subject</code> | Opsional:{' '}
          <code className="bg-ink-100 px-1 rounded">author</code>,{' '}
          <code className="bg-ink-100 px-1 rounded">authorBio</code>,{' '}
          <code className="bg-ink-100 px-1 rounded">bookSummary</code>
        </p>
      </div>

      {parsing && (
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <Loader2 size={14} className="animate-spin" /> Membaca file...
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-100">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-600 flex items-center gap-1.5">
              <FileSpreadsheet size={14} />
              {preview.length} buku siap diproses
            </span>
          </div>

          <div className="bg-ink-50 rounded-xl border border-ink-100 max-h-40 overflow-y-auto custom-scroll">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="text-left p-2 font-bold text-ink-500">#</th>
                  <th className="text-left p-2 font-bold text-ink-500">
                    Judul
                  </th>
                  <th className="text-left p-2 font-bold text-ink-500">
                    Subjek
                  </th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-ink-100/50">
                    <td className="p-2 text-ink-400">{i + 1}</td>
                    <td className="p-2 font-medium truncate max-w-[200px]">
                      {row.title}
                    </td>
                    <td className="p-2 text-ink-500">{row.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={startBulk}
            disabled={generating}
            className="w-full py-3 bg-ink-900 text-white rounded-xl font-black text-xs tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:bg-ink-300 shadow-lg active:scale-[0.98] uppercase"
          >
            {generating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Proses {preview.length} buku
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
