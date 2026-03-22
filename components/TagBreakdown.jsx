'use client';

const TAG_CATEGORIES = [
  { key: 'broad', label: 'Broad', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { key: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { key: 'longTail', label: 'Long-tail', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { key: 'brand', label: 'Brand', color: 'bg-purple-50 text-purple-700 border-purple-100' },
];

export default function TagBreakdown({ tagBreakdown, allTags }) {
  // If we have structured breakdown, show categorized
  if (tagBreakdown && Object.keys(tagBreakdown).length > 0) {
    return (
      <div className="space-y-3">
        {TAG_CATEGORIES.map(({ key, label, color }) => {
          const tags = tagBreakdown[key] || [];
          if (tags.length === 0) return null;

          return (
            <div key={key}>
              <span className="text-[10px] font-black text-ink-400 uppercase tracking-widest block mb-1.5">
                {label}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${color}`}
                  >
                    #{tag.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback: flat tag list
  if (allTags && allTags.length > 0) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold px-2 py-0.5 rounded-md border bg-deep-50 text-deep-700 border-deep-100"
          >
            #{tag.replace(/\s+/g, '')}
          </span>
        ))}
      </div>
    );
  }

  return null;
}
