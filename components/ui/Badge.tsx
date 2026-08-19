import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "error" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  interactive?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    "bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25 hover:border-blue-400/50",
  secondary:
    "bg-gray-700/50 text-gray-300 border border-gray-600/40 hover:bg-gray-700/80 hover:border-gray-500/60",
  success:
    "bg-green-500/15 text-green-300 border border-green-500/30 hover:bg-green-500/25 hover:border-green-400/50",
  warning:
    "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-400/50",
  error:
    "bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25 hover:border-red-400/50",
  outline:
    "border border-gray-500/50 text-gray-300 hover:border-gray-400/70 hover:text-white",
};

export function Badge({
  children,
  variant = "secondary",
  className,
  interactive = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        // Transition always on (cheap)
        "transition-all duration-200",
        // Hover scale only if interactive
        interactive && "cursor-pointer hover:scale-105 active:scale-95",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
