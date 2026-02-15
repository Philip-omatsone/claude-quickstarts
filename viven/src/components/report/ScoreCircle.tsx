"use client";

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreCircle({
  score,
  maxScore = 100,
  label,
  size = "md",
}: ScoreCircleProps) {
  const percentage = (score / maxScore) * 100;
  const radius = size === "sm" ? 28 : size === "md" ? 36 : 44;
  const strokeWidth = size === "sm" ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const svgSize = (radius + strokeWidth) * 2;

  const getColor = () => {
    if (percentage >= 70) return "#16A34A";
    if (percentage >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const textSize =
    size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-2xl";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div
        className="absolute flex items-center justify-center"
        style={{ width: svgSize, height: svgSize }}
      >
        <span className={`font-heading font-bold ${textSize}`}>
          {score}
        </span>
      </div>
      <span className="text-xs text-muted text-center">{label}</span>
    </div>
  );
}
