'use client';

const CRITERIA = [
  { key: 'keywordIn40Chars', label: 'Keyword di awal judul', max: 25 },
  { key: 'titleUnder120', label: 'Panjang judul sesuai limit', max: 10 },
  { key: 'specificHook', label: 'Hook spesifik per bidang', max: 15 },
  { key: 'chaptersMin6', label: 'Bedah isi ≥6 bab', max: 15 },
  { key: 'tagHierarchy', label: 'Hierarki tag lengkap', max: 15 },
  { key: 'authorCredential', label: 'Kredensial penulis', max: 10 },
  { key: 'descLength', label: 'Panjang deskripsi 2500-3000', max: 10 },
];

export default function ScoreBreakdown({ scoreBreakdown, totalScore }) {
  if (!scoreBreakdown) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-ink-400 uppercase tracking-widest">
          Skor breakdown
        </span>
        <span
          className={`text-2xl font-black font-display ${
            totalScore >= 80
              ? 'text-emerald-600'
              : totalScore >= 60
              ? 'text-amber-600'
              : 'text-red-600'
          }`}
        >
          {totalScore}/100
        </span>
      </div>

      {CRITERIA.map(({ key, label, max }) => {
        const score = scoreBreakdown[key] ?? 0;
        const pct = Math.round((score / max) * 100);
        const isFull = score >= max;

        return (
          <div key={key} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-ink-600">{label}</span>
              <span
                className={`text-xs font-bold ${
                  isFull ? 'text-emerald-600' : 'text-ink-400'
                }`}
              >
                {score}/{max}
              </span>
            </div>
            <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
              <div
                className={`score-bar h-full rounded-full transition-all ${
                  isFull
                    ? 'bg-emerald-500'
                    : pct >= 50
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
