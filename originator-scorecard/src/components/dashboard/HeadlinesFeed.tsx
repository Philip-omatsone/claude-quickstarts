import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { db } from '../../db/database';
import type { HeadlineCategory, HeadlineImpact } from '../../types';

const categoryColors: Record<HeadlineCategory, string> = {
  earnings: 'bg-blue-100 text-blue-700',
  regulatory: 'bg-purple-100 text-purple-700',
  market: 'bg-green-100 text-green-700',
  risk: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700',
};

const impactColors: Record<HeadlineImpact, string> = {
  high: 'text-rag-red font-semibold',
  medium: 'text-rag-amber',
  low: 'text-text-secondary',
};

export default function HeadlinesFeed() {
  const headlines = useLiveQuery(
    () => db.headlines.orderBy('date').reverse().limit(5).toArray(),
    [],
  );

  // Deduplicate by title
  const seen = new Set<string>();
  const deduped = (headlines ?? []).filter((h) => {
    if (seen.has(h.title)) return false;
    seen.add(h.title);
    return true;
  });

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary" style={{ fontFamily: 'var(--font-family-heading)' }}>Recent Headlines</h3>
        <Link to="/headlines" className="text-xs text-accent hover:text-accent-hover">
          View all
        </Link>
      </div>
      {deduped.length === 0 ? (
        <div className="text-sm text-text-secondary py-4 text-center">No headlines yet</div>
      ) : (
        <ul className="space-y-3">
          {deduped.map((h) => (
            <li key={h.id} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[h.category]}`}>
                    {h.category}
                  </span>
                  {h.impact && (
                    <span className={`text-[10px] ${impactColors[h.impact]}`}>
                      {h.impact}
                    </span>
                  )}
                  <span className="text-[10px] text-text-secondary">{h.source}</span>
                </div>
                <p className="text-xs text-text-primary truncate">{h.title}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  {new Date(h.date).toLocaleDateString('en-GB')}
                </p>
              </div>
              {h.url && (
                <a
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent shrink-0"
                >
                  <ExternalLink size={12} />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
