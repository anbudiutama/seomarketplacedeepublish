'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, Pencil, Save } from 'lucide-react';
import ScoreBreakdown from './ScoreBreakdown';
import TagBreakdown from './TagBreakdown';
import CharCounter from './CharCounter';
import { MARKETPLACES } from '@/lib/prompts';

export default function ResultCard({ result, marketplace = 'shopee' }) {
  const [copiedField, setCopiedField] = useState(null);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState(result.optimizedDescription);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(result.seoTitle);

  const mp = MARKETPLACES[marketplace] || MARKETPLACES.shopee;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const allTagsString = (result.tags || [])
    .map((t) => `#${t.replace(/\s+/g, '')}`)
    .join(' ');

  return (
    <div className="space-y-5 animate-fade-in">
      {/* SEO Title */}
      <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-sm relative overflow-hidden">
        <div
          className="absolute top-0 right-0 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-xl text-white"
          style={{ background: mp.color }}
        >
          {mp.name}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-ink-400 uppercase tracking-widest">
            Judul optimasi
          </span>
          <CharCounter
            current={editedTitle.length}
            max={mp.titleMaxChars}
            label="Karakter"
          />
        </div>

        {editingTitle ? (
          <div className="space-y-2">
            <textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-3 bg-ink-50 rounded-xl border border-deep-200 outline-none focus:ring-2 focus:ring-deep-500 text-sm font-bold resize-none"
              rows={2}
            />
            <button
              onClick={() => setEditingTitle(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
            >
              <Save size={12} /> Simpan
            </button>
          </div>
        ) : (
          <div className="relative group">
            <div className="p-4 bg-ink-50 rounded-xl border border-ink-100 text-sm font-bold text-ink-800 leading-relaxed pr-20 italic">
              &ldquo;{editedTitle}&rdquo;
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                onClick={() => setEditingTitle(true)}
                className="p-2 hover:bg-white rounded-lg text-ink-300 hover:text-deep-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Edit judul"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => copyToClipboard(editedTitle, 'title')}
                className="p-2 hover:bg-white rounded-lg text-ink-300 hover:text-deep-600 transition-colors"
                title="Copy judul"
              >
                {copiedField === 'title' ? (
                  <CheckCircle2 className="text-emerald-500" size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Score Breakdown — Peningkatan #4 */}
      <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-sm">
        <ScoreBreakdown
          scoreBreakdown={result.scoreBreakdown}
          totalScore={result.seoScore}
        />
      </div>

      {/* Master Copy — Description with inline edit (Peningkatan #5) */}
      <div className="bg-white p-6 rounded-2xl border-2 border-deep-100 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-deep-600 text-white px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-md z-10">
          Master copy
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="pr-4">
            <h4 className="font-black text-ink-900 text-xl italic leading-none tracking-tight">
              Deskripsi penjualan
            </h4>
            <div className="mt-2">
              <CharCounter
                current={editedDesc.length}
                max={mp.descMaxChars}
                label="Karakter deskripsi"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {editingDesc ? (
              <button
                onClick={() => setEditingDesc(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center gap-1.5"
              >
                <Save size={14} /> Simpan
              </button>
            ) : (
              <button
                onClick={() => setEditingDesc(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-ink-100 text-ink-600 hover:bg-ink-200 transition-all flex items-center gap-1.5"
              >
                <Pencil size={14} /> Edit
              </button>
            )}
            <button
              onClick={() =>
                copyToClipboard(`${editedDesc}\n\n${allTagsString}`, 'full')
              }
              className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-1.5 whitespace-nowrap ${
                copiedField === 'full'
                  ? 'bg-emerald-500 text-white scale-105'
                  : 'bg-ink-900 text-white hover:bg-black active:scale-[0.98]'
              }`}
            >
              {copiedField === 'full' ? (
                <CheckCircle2 size={14} />
              ) : (
                <Copy size={14} />
              )}
              {copiedField === 'full' ? 'TERSALIN' : 'SALIN SEMUA'}
            </button>
          </div>
        </div>

        {editingDesc ? (
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="w-full p-5 bg-ink-50 rounded-2xl border border-deep-200 outline-none focus:ring-2 focus:ring-deep-500 text-sm text-ink-700 leading-relaxed font-medium resize-y min-h-[400px]"
            rows={20}
          />
        ) : (
          <div className="bg-ink-50 p-5 rounded-2xl border border-ink-100 max-h-[500px] overflow-y-auto text-sm text-ink-700 leading-relaxed font-medium custom-scroll shadow-inner">
            <div className="whitespace-pre-wrap">{editedDesc}</div>
          </div>
        )}

        {/* Tags — Peningkatan #1 (tag hierarchy) */}
        <div className="mt-5 pt-5 border-t border-ink-100">
          <span className="text-[10px] font-black text-ink-400 uppercase tracking-widest block mb-3">
            Keyword indexing
          </span>
          <TagBreakdown
            tagBreakdown={result.tagBreakdown}
            allTags={result.tags}
          />
        </div>
      </div>
    </div>
  );
}
