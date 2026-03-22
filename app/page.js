'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  FileText,
  ShieldCheck,
  History,
  Trash2,
  ChevronDown,
  Layers,
  UploadCloud,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { MARKETPLACES, SUBJECTS } from '@/lib/prompts';
import ResultCard from '@/components/ResultCard';
import BulkUpload from '@/components/BulkUpload';
import ExportButton from '@/components/ExportButton';

export default function Home() {
  // --- State ---
  const [history, setHistory] = useState([]);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    subject: '',
    authorBio: '',
    bookSummary: '',
  });
  const [marketplace, setMarketplace] = useState('shopee');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('single'); // 'single' | 'bulk'
  const [bulkResults, setBulkResults] = useState(null);

  const mp = MARKETPLACES[marketplace];

  // --- Load history from Supabase ---
  const loadHistory = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;

    const { data, error: fetchErr } = await sb
      .from('seo_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!fetchErr && data) {
      setHistory(data);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // --- Save to Supabase ---
  const saveToHistory = async (input, resultData, mp) => {
    const sb = getSupabase();
    if (!sb) return;

    const { error: insertErr } = await sb.from('seo_history').insert({
      marketplace: mp,
      input,
      result: resultData,
      seo_title: resultData.seoTitle,
      seo_score: resultData.seoScore,
      created_at: new Date().toISOString(),
    });

    if (!insertErr) {
      loadHistory();
    }
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Peningkatan #2: Client-side validation ---
  const validate = () => {
    if (!bookData.title || bookData.title.trim().length < 5) {
      setError('Judul buku minimal 5 karakter.');
      return false;
    }
    if (!bookData.subject || bookData.subject.trim().length < 2) {
      setError('Bidang ilmu wajib dipilih.');
      return false;
    }
    return true;
  };

  // --- Generate SEO (single) ---
  const generateSEO = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookData, marketplace }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal menghasilkan konten.');
        setLoading(false);
        return;
      }

      setResult(data.result);
      await saveToHistory(bookData, data.result, marketplace);
    } catch (err) {
      setError('Network error. Periksa koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  // --- Delete history item ---
  const deleteHistoryItem = async (id) => {
    const sb = getSupabase();
    if (!sb) return;

    await sb.from('seo_history').delete().eq('id', id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Bulk results handler ---
  const handleBulkResults = async (results) => {
    setBulkResults(results);

    // Save successful results to history
    for (const r of results) {
      if (r.result) {
        await saveToHistory(r.input, r.result, marketplace);
      }
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-ink-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-deep-600 rounded-xl flex items-center justify-center shadow-lg shadow-deep-600/20">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tighter text-base uppercase italic font-display hidden sm:block">
              Deeppro{' '}
              <span className="text-deep-500">SEO</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Marketplace selector — Peningkatan #3 */}
            <div className="relative">
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                className="appearance-none bg-ink-50 border border-ink-200 rounded-lg px-3 py-1.5 pr-7 text-[11px] font-bold cursor-pointer hover:border-ink-300 transition-colors"
                style={{ color: mp.color }}
              >
                {Object.entries(MARKETPLACES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400"
              />
            </div>

            <div className="bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
              <ShieldCheck className="text-emerald-500 w-3.5 h-3.5" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                v2.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Input & History */}
          <div className="lg:col-span-5 space-y-5">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode('single')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'single'
                    ? 'bg-ink-900 text-white shadow-lg'
                    : 'bg-white text-ink-500 border border-ink-200 hover:border-ink-300'
                }`}
              >
                <Layers size={14} /> Satu Buku
              </button>
              <button
                onClick={() => setMode('bulk')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'bulk'
                    ? 'bg-ink-900 text-white shadow-lg'
                    : 'bg-white text-ink-500 border border-ink-200 hover:border-ink-300'
                }`}
              >
                <UploadCloud size={14} /> Bulk CSV
              </button>
            </div>

            {mode === 'single' ? (
              /* Single book form */
              <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-sm space-y-4">
                <h3 className="font-bold text-ink-800 flex items-center gap-2 text-xs uppercase tracking-widest border-b border-ink-50 pb-2">
                  <FileText size={16} className="text-deep-500" /> Form optimasi
                  buku
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-ink-400 uppercase mb-1 block ml-0.5">
                      Judul buku *
                    </label>
                    <input
                      name="title"
                      value={bookData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-ink-50 rounded-xl border border-ink-100 outline-none focus:ring-2 focus:ring-deep-500 focus:bg-white text-sm font-bold transition-all"
                      placeholder="Minimal 5 karakter..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-ink-400 uppercase mb-1 block ml-0.5">
                        Penulis
                      </label>
                      <input
                        name="author"
                        value={bookData.author}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-ink-50 rounded-xl border border-ink-100 outline-none focus:ring-2 focus:ring-deep-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="Nama..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-ink-400 uppercase mb-1 block ml-0.5">
                        Bidang ilmu *
                      </label>
                      {/* Peningkatan #2: dropdown subject */}
                      <div className="relative">
                        <select
                          name="subject"
                          value={bookData.subject}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-ink-50 rounded-xl border border-ink-100 outline-none focus:ring-2 focus:ring-deep-500 focus:bg-white text-sm font-bold transition-all appearance-none cursor-pointer pr-8"
                        >
                          <option value="">Pilih...</option>
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-ink-100">
                  <div>
                    <label className="text-[10px] font-black text-ink-400 uppercase mb-1 block ml-0.5">
                      Profil singkat dosen
                    </label>
                    <textarea
                      name="authorBio"
                      value={bookData.authorBio}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full p-3 bg-ink-50 rounded-xl border border-ink-100 outline-none focus:ring-2 focus:ring-deep-500 focus:bg-white text-xs font-medium leading-relaxed resize-none"
                      placeholder="Copy-paste dari CV penulis..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-ink-400 uppercase mb-1 block ml-0.5">
                      Resensi / materi utama
                    </label>
                    <textarea
                      name="bookSummary"
                      value={bookData.bookSummary}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 bg-ink-50 rounded-xl border border-ink-100 outline-none focus:ring-2 focus:ring-deep-500 focus:bg-white text-xs font-medium leading-relaxed resize-none"
                      placeholder="Copy-paste dari resensi buku..."
                    />
                  </div>
                </div>

                <button
                  onClick={generateSEO}
                  disabled={loading}
                  className="w-full py-3.5 bg-ink-900 text-white rounded-xl font-black text-xs tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:bg-ink-300 shadow-xl active:scale-[0.98] uppercase"
                >
                  {loading ? (
                    <>
                      <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-white" />
                      <span
                        className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-white"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <span
                        className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-white"
                        style={{ animationDelay: '0.4s' }}
                      />
                      <span className="ml-1">Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="text-deep-400" /> Optimasi
                      strategis
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold text-center border border-red-100 uppercase">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              /* Bulk mode — Peningkatan #7 */
              <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-sm space-y-4">
                <h3 className="font-bold text-ink-800 flex items-center gap-2 text-xs uppercase tracking-widest border-b border-ink-50 pb-2">
                  <UploadCloud size={16} className="text-deep-500" /> Bulk
                  processing
                </h3>
                <BulkUpload
                  marketplace={marketplace}
                  onResults={handleBulkResults}
                />
              </div>
            )}

            {/* History — with Export (Peningkatan #8) */}
            <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink-800 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <History size={16} className="text-ink-400" /> Riwayat
                </h3>
                <ExportButton history={history} />
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto custom-scroll pr-1">
                {history.length === 0 ? (
                  <p className="text-[10px] text-ink-400 text-center italic font-bold uppercase py-4">
                    Belum ada riwayat
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-ink-50 p-3 rounded-xl border border-ink-100 hover:border-deep-200 transition-all cursor-pointer"
                      onClick={() => setResult(item.result || item)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-ink-700 truncate mb-0.5">
                            {item.seo_title || item.result?.seoTitle || 'Untitled'}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-bold text-ink-400">
                              {item.created_at
                                ? new Date(item.created_at).toLocaleDateString('id-ID')
                                : ''}
                            </span>
                            {item.marketplace && (
                              <span
                                className="text-[8px] font-black uppercase"
                                style={{
                                  color:
                                    MARKETPLACES[item.marketplace]?.color || '#666',
                                }}
                              >
                                {item.marketplace}
                              </span>
                            )}
                            {(item.seo_score || item.result?.seoScore) && (
                              <span className="text-[8px] font-bold text-emerald-600">
                                Score: {item.seo_score || item.result?.seoScore}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-ink-400 hover:text-red-500 transition-all flex-shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-7 space-y-5">
            {/* Bulk results */}
            {mode === 'bulk' && bulkResults && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-600">
                    {bulkResults.filter((r) => r.result).length}/
                    {bulkResults.length} berhasil diproses
                  </span>
                </div>
                {bulkResults.map((item, i) =>
                  item.result ? (
                    <ResultCard
                      key={i}
                      result={item.result}
                      marketplace={marketplace}
                    />
                  ) : (
                    <div
                      key={i}
                      className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-700"
                    >
                      {item.error}
                    </div>
                  )
                )}
              </div>
            )}

            {/* Single result */}
            {mode === 'single' && result ? (
              <ResultCard result={result} marketplace={marketplace} />
            ) : (
              mode === 'single' &&
              !result && (
                <div className="h-full min-h-[500px] border-2 border-dashed border-ink-200 rounded-3xl flex flex-col items-center justify-center text-ink-300 p-12 text-center bg-white/50">
                  <div className="w-20 h-20 bg-ink-50 rounded-full flex items-center justify-center mb-5">
                    <TrendingUp
                      size={40}
                      className="opacity-10 text-deep-600"
                    />
                  </div>
                  <p className="font-black uppercase text-xs text-ink-400 italic tracking-widest">
                    Sistem siap analisis
                  </p>
                  <p className="text-[10px] max-w-xs mt-3 font-bold leading-relaxed text-ink-400">
                    Pilih marketplace, isi data buku, tekan Optimasi Strategis
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-ink-400 text-[10px] font-black uppercase px-4 tracking-widest">
        © 2025 Deepublish Ecosystem &bull; Menerbitkan Ilmu &bull; Mencerdaskan
        Bangsa
      </footer>
    </div>
  );
}
