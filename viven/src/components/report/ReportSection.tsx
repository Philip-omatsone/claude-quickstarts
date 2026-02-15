import { type LucideIcon } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";

interface ReportSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  unavailable?: boolean;
  children: React.ReactNode;
}

export function ReportSection({
  icon,
  title,
  subtitle,
  unavailable,
  children,
}: ReportSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-border p-6 md:p-8">
      <div className="flex items-start gap-3 mb-6">
        <IconCircle icon={icon} size="md" />
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {unavailable ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Data temporarily unavailable. This section will be updated once the
          data source responds.
        </div>
      ) : (
        children
      )}
    </section>
  );
}
