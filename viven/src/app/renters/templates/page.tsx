"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Wrench, PoundSterling, TrendingUp, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { IconCircle } from "@/components/IconCircle";

const templates = [
  {
    icon: Wrench,
    title: "Request Repairs from Landlord",
    description:
      "Formally request your landlord to carry out repairs they are legally responsible for under Section 11 of the Landlord and Tenant Act 1985.",
    href: "/renters/templates/email-landlord-repair",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: PoundSterling,
    title: "Request Deposit Return",
    description:
      "Ask for your tenancy deposit back after moving out, referencing the deposit protection scheme and the 10-day return rule.",
    href: "/renters/templates/email-deposit-return",
    color: "bg-emerald-50 border-emerald-100",
  },
  {
    icon: TrendingUp,
    title: "Challenge a Rent Increase",
    description:
      "Push back on an unreasonable rent increase with comparable local rents and a reference to your rights under the Housing Act 1988.",
    href: "/renters/templates/email-rent-increase",
    color: "bg-amber-50 border-amber-100",
  },
  {
    icon: FileText,
    title: "Request a Tenant Reference Letter",
    description:
      "Ask your current or previous landlord to provide a reference letter confirming your tenancy history and conduct.",
    href: "/renters/templates/reference-letter",
    color: "bg-purple-50 border-purple-100",
  },
];

export default function TemplatesHubPage() {
  return (
    <div className="page-transition max-w-3xl mx-auto px-4 pt-8 pb-16">
      <Link
        href="/renters"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Renters
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Email Templates
          </h1>
          <p className="text-muted text-sm">
            Ready-to-send emails for common renting situations
          </p>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-8">
        Each template is written with UK renting law in mind. Copy, personalise
        the highlighted fields, and send. Always keep a written record of
        correspondence with your landlord or letting agent.
      </p>

      <div className="grid gap-5">
        {templates.map((template, i) => (
          <motion.div
            key={template.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={template.href}
              className={`block rounded-2xl border p-6 hover:shadow-md transition-all ${template.color}`}
            >
              <div className="flex items-start gap-4">
                <IconCircle icon={template.icon} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-foreground text-lg">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted mt-1.5">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3">
                    Use template <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
