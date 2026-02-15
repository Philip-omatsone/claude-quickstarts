import Link from "next/link";
import { Logo } from "./Logo";

const footerLinks = {
  Product: [
    { label: "Buyer Report", href: "/buyers" },
    { label: "Rental Report", href: "/renters" },
    { label: "Reports & Tools", href: "/reports" },
    { label: "Pricing", href: "/reports" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Data Sources", href: "/data-sources" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-footer-bg border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo size="sm" />
            <p className="mt-4 text-sm text-muted leading-relaxed">
              Viven helps UK home buyers and renters make smarter property
              decisions with comprehensive, data-driven reports.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-foreground mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Viven. All rights reserved.
          </p>
          <p className="text-sm text-muted">
            Data sourced from UK Government open data, ONS, and public APIs.
          </p>
        </div>
      </div>
    </footer>
  );
}
