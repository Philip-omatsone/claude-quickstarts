"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { glossaryTerms } from "@/lib/data/glossary-data";

export default function AZGlossaryPage() {
  const [search, setSearch] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = useMemo(() => {
    if (!search) return glossaryTerms;
    const q = search.toLowerCase();
    return glossaryTerms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.aka?.some((a) => a.toLowerCase().includes(q))
    );
  }, [search]);

  // Group by letter
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(term);
    }
    return map;
  }, [filtered]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const activeLetters = new Set(Object.keys(grouped));

  const scrollToLetter = (letter: string) => {
    sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page-transition max-w-3xl mx-auto px-4 pt-8 pb-16">
      <Link href="/buyers/guides" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> All Guides
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">A-Z of Home Buying</h1>
          <p className="text-muted text-sm">Every term you&apos;ll encounter, explained in plain English</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>

      {/* Alphabet nav */}
      <div className="flex flex-wrap gap-1 mb-8 sticky top-16 z-10 bg-background py-2">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => scrollToLetter(letter)}
            disabled={!activeLetters.has(letter)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              activeLetters.has(letter)
                ? "bg-white border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary"
                : "text-gray-300 cursor-default"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Terms */}
      <div className="space-y-8">
        {alphabet.map((letter) => {
          const terms = grouped[letter];
          if (!terms || terms.length === 0) return null;
          return (
            <div
              key={letter}
              ref={(el) => { sectionRefs.current[letter] = el; }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-heading font-bold text-sm">
                  {letter}
                </span>
                <span className="text-xs text-muted">{terms.length} term{terms.length > 1 ? "s" : ""}</span>
              </div>
              <div className="bg-white rounded-xl border border-border divide-y divide-border">
                {terms.map((term) => {
                  const isExpanded = expandedTerm === term.term;
                  return (
                    <div key={term.term} className="px-4">
                      <button
                        onClick={() => setExpandedTerm(isExpanded ? null : term.term)}
                        className="w-full flex items-center justify-between py-3 text-left"
                      >
                        <div>
                          <span className="font-medium text-foreground text-sm">{term.term}</span>
                          {term.aka && term.aka.length > 0 && (
                            <span className="text-xs text-muted ml-2">
                              (also: {term.aka.join(", ")})
                            </span>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted shrink-0" />}
                      </button>
                      {isExpanded && (
                        <div className="pb-4">
                          <p className="text-sm text-muted leading-relaxed">{term.definition}</p>
                          {term.whyItMatters && (
                            <p className="text-sm text-primary mt-2 leading-relaxed">
                              <strong>Why it matters:</strong> {term.whyItMatters}
                            </p>
                          )}
                          {term.relatedLinks && term.relatedLinks.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {term.relatedLinks.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="text-xs text-primary font-medium flex items-center gap-1 bg-primary-light px-2.5 py-1 rounded-full hover:bg-primary/10"
                                >
                                  {link.label} <ArrowRight className="w-3 h-3" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">No terms match &quot;{search}&quot;. Try a different search.</p>
      )}

      <p className="text-center text-xs text-muted mt-12">
        {glossaryTerms.length} terms covering the full A-Z of UK home buying
      </p>
    </div>
  );
}
