import { type LucideIcon } from "lucide-react";

interface IconCircleProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
}

export function IconCircle({ icon: Icon, size = "md" }: IconCircleProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary-light flex items-center justify-center flex-shrink-0`}
    >
      <Icon className={`${iconSizes[size]} text-primary`} />
    </div>
  );
}
