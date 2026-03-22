'use client';

export default function CharCounter({ current, max, label }) {
  const pct = Math.round((current / max) * 100);
  const isOver = current > max;
  const isNear = pct >= 85 && !isOver;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-[10px] font-black tabular-nums ${
          isOver
            ? 'text-red-600'
            : isNear
            ? 'text-amber-600'
            : 'text-emerald-600'
        }`}
      >
        {current}/{max}
      </span>
      {isOver && (
        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
          OVER {current - max}
        </span>
      )}
    </div>
  );
}
