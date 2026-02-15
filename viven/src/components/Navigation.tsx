"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import {
  Calculator, ClipboardList, BookOpen, Sparkles, TrendingUp,
  PiggyBank, Mail, ChevronDown, Menu, X,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface NavChild {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavItem {
  href: string;
  label: string;
  children?: NavChild[];
}

const buyerLinks: NavChild[] = [
  { href: "/buyers/calculators", label: "Calculators", icon: Calculator },
  { href: "/buyers/checklists", label: "Checklists", icon: ClipboardList },
  { href: "/buyers/guides", label: "Guides", icon: BookOpen },
  { href: "/buyers/tips", label: "Tips", icon: Sparkles },
  { href: "/buyers/market", label: "Market Data", icon: TrendingUp },
];

const renterLinks: NavChild[] = [
  { href: "/renters/calculators", label: "Calculators", icon: PiggyBank },
  { href: "/renters/checklists", label: "Checklists", icon: ClipboardList },
  { href: "/renters/guides", label: "Guides", icon: BookOpen },
  { href: "/renters/tips", label: "Tips", icon: Sparkles },
  { href: "/renters/templates", label: "Templates", icon: Mail },
];

const navItems: NavItem[] = [
  { href: "/buyers", label: "For Buyers", children: buyerLinks },
  { href: "/renters", label: "For Renters", children: renterLinks },
  { href: "/reports", label: "Reports & Tools" },
];

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isHome) return null;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Logo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center bg-gray-100 rounded-full p-1 gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="w-3 h-3" />
                </Link>

                {openDropdown === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-border shadow-lg py-2 z-50">
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-foreground hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Icon className="w-4 h-4 text-primary" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/reports"
            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
          >
            Get a Report
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block font-heading font-semibold text-foreground py-1"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const Icon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 text-sm text-muted py-1.5 hover:text-foreground transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/reports"
            className="block bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium text-center"
            onClick={() => setMobileOpen(false)}
          >
            Get a Report
          </Link>
        </div>
      )}
    </header>
  );
}
