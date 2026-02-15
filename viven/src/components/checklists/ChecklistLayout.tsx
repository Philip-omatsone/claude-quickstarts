"use client";

import Link from "next/link";
import { ArrowLeft, CheckSquare } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useState, useEffect, useCallback, type ReactNode } from "react";

export interface ChecklistItem {
  id: string;
  text: string;
  tip?: string;
  subItems?: string[];
}

export interface ChecklistPhase {
  title: string;
  items: ChecklistItem[];
}

interface ChecklistLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  backHref: string;
  backLabel: string;
  storageKey: string;
  phases: ChecklistPhase[];
  intro?: ReactNode;
}

export function ChecklistLayout({
  title,
  subtitle,
  icon: Icon,
  backHref,
  backLabel,
  storageKey,
  phases,
  intro,
}: ChecklistLayoutProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setChecked(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, [storageKey]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const completedItems = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="page-transition max-w-3xl mx-auto px-4 pt-8 pb-16">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-muted text-sm">{subtitle}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-border p-4 mb-8 sticky top-16 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {completedItems} of {totalItems} completed
          </span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {intro && <div className="mb-8">{intro}</div>}

      <div className="space-y-8">
        {phases.map((phase, pi) => (
          <PhaseSection
            key={pi}
            phase={phase}
            checked={checked}
            toggle={toggle}
          />
        ))}
      </div>

      {progress === 100 && (
        <div className="mt-8 bg-primary-light border border-primary/20 rounded-xl p-6 text-center">
          <CheckSquare className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-heading font-bold text-foreground text-lg">
            All done!
          </p>
          <p className="text-sm text-muted mt-1">
            You&apos;ve completed every item on this checklist.
          </p>
        </div>
      )}
    </div>
  );
}

function PhaseSection({
  phase,
  checked,
  toggle,
}: {
  phase: ChecklistPhase;
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
}) {
  const completed = phase.items.filter((item) => checked[item.id]).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-bold text-foreground text-lg">
          {phase.title}
        </h2>
        <span className="text-xs text-muted bg-gray-100 px-2 py-1 rounded-full">
          {completed}/{phase.items.length}
        </span>
      </div>
      <div className="bg-white rounded-xl border border-border divide-y divide-border">
        {phase.items.map((item) => (
          <div key={item.id} className="p-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/30 accent-primary cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm ${checked[item.id] ? "line-through text-muted" : "text-foreground"} transition-colors`}
                >
                  {item.text}
                </span>
                {item.tip && (
                  <p className="text-xs text-primary mt-1 leading-relaxed">
                    Tip: {item.tip}
                  </p>
                )}
                {item.subItems && item.subItems.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.subItems.map((sub, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted flex items-start gap-1.5"
                      >
                        <span className="text-muted mt-0.5">&mdash;</span>
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
