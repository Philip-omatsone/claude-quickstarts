"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Check, AlertTriangle } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

interface TemplateLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  backHref: string;
  backLabel: string;
  whenToUse: string;
  template: string;
  warnings?: string[];
  children?: ReactNode;
}

export function TemplateLayout({
  title,
  subtitle,
  icon: Icon,
  backHref,
  backLabel,
  whenToUse,
  template,
  warnings,
  children,
}: TemplateLayoutProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <h2 className="font-heading font-semibold text-foreground mb-2">
          When to use this template
        </h2>
        <p className="text-sm text-muted leading-relaxed">{whenToUse}</p>
      </div>

      {children && <div className="mb-6">{children}</div>}

      <div className="relative">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">
              Template
            </h2>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy to clipboard
                </>
              )}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans bg-background rounded-lg p-4 border border-border">
            {template}
          </pre>
        </div>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-amber-800 text-sm">
              Important
            </span>
          </div>
          <ul className="space-y-1.5">
            {warnings.map((w, i) => (
              <li key={i} className="text-sm text-amber-700">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
