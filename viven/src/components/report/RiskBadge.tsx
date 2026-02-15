import { RiskLevel } from "@/lib/api/types";

const riskConfig: Record<
  RiskLevel,
  { label: string; color: string; bg: string }
> = {
  very_low: { label: "Very Low", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  low: { label: "Low", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  high: { label: "High", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const config = riskConfig[level];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
    >
      {config.label}
    </span>
  );
}
