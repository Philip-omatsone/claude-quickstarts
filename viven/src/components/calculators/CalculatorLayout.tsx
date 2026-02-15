"use client";

import Link from "next/link";
import { ArrowLeft, Info, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

interface CalculatorLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  methodology?: string;
  faqs?: { q: string; a: string }[];
}

export function CalculatorLayout({
  title,
  subtitle,
  icon: Icon,
  backHref,
  backLabel,
  children,
  methodology,
  faqs,
}: CalculatorLayoutProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="flex items-center gap-3 mb-2">
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

      <div className="mt-8">{children}</div>

      {methodology && (
        <div className="mt-8">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            <Info className="w-4 h-4" />
            How this works
            {showMethodology ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          {showMethodology && (
            <div className="mt-3 bg-white rounded-xl border border-border p-5 text-sm text-muted leading-relaxed whitespace-pre-line">
              {methodology}
            </div>
          )}
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium text-foreground text-sm">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-muted leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export function InsightBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary-light border border-primary/20 rounded-xl p-4 flex gap-3 mt-6">
      <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="text-sm text-foreground leading-relaxed">{children}</div>
    </div>
  );
}

export function ResultCard({
  label,
  value,
  sublabel,
  large,
}: {
  label: string;
  value: string;
  sublabel?: string;
  large?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`font-heading font-bold mt-1 ${large ? "text-2xl md:text-3xl text-primary" : "text-lg"}`}
      >
        {value}
      </p>
      {sublabel && <p className="text-[11px] text-muted mt-0.5">{sublabel}</p>}
    </div>
  );
}

export function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = "number",
  min,
  max,
  step,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${prefix ? "pl-7" : ""} ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  displayValue,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  displayValue: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-semibold text-primary">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-[11px] text-muted mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function ToggleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              value === opt.value
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function formatGBP(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
