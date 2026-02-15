"use client";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="bg-primary rounded-lg flex items-center justify-center"
        style={{ width: s.icon, height: s.icon }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
          style={{ width: s.icon * 0.6, height: s.icon * 0.6 }}
        >
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="12"
              y1="12"
              x2={12 + 8 * Math.cos((angle * Math.PI) / 180)}
              y2={12 + 8 * Math.sin((angle * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
      <span
        className={`font-heading font-bold text-foreground ${s.text}`}
      >
        Viven
      </span>
    </div>
  );
}
