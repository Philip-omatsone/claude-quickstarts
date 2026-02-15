"use client";

import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface GuideLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  backHref: string;
  backLabel: string;
  readTime?: string;
  children: ReactNode;
  relatedLinks?: { label: string; href: string }[];
}

export function GuideLayout({
  title,
  subtitle,
  icon: Icon,
  backHref,
  backLabel,
  readTime,
  children,
  relatedLinks,
}: GuideLayoutProps) {
  return (
    <div className="page-transition max-w-3xl mx-auto px-4 pt-8 pb-16">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-muted text-sm mt-1">{subtitle}</p>
          {readTime && (
            <div className="flex items-center gap-1 text-xs text-muted mt-2">
              <Clock className="w-3 h-3" />
              {readTime} read
            </div>
          )}
        </div>
      </div>

      <div className="prose-viven">{children}</div>

      {relatedLinks && relatedLinks.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <h3 className="font-heading font-bold text-foreground mb-4">
            Related
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between bg-white rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function GuideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="font-heading text-xl font-bold text-foreground mb-3">
        {title}
      </h2>
      <div className="text-sm text-muted leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export function GuideCallout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: ReactNode;
}) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    tip: "bg-primary-light border-primary/20 text-foreground",
  };
  return (
    <div className={`rounded-xl border p-4 text-sm leading-relaxed my-4 ${styles[type]}`}>
      {children}
    </div>
  );
}

export function GuideStep({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-foreground mb-1">
          {title}
        </h3>
        <div className="text-sm text-muted leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
