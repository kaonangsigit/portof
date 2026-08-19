"use client";
import { cn } from "@/lib/utils";
import { useRef, MouseEvent } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 shadow-sm hover:shadow-blue-500/25 hover:shadow-md",
  secondary:
    "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600 hover:border-gray-500",
  outline:
    "border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 focus:ring-blue-500 hover:border-blue-400",
  ghost:
    "text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3 text-base gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Ripple effect on click
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${x - size / 2}px;top:${y - size / 2}px;
      border-radius:50%;
      background:rgba(255,255,255,0.15);
      transform:scale(0);
      animation:btn-ripple 0.5s ease-out forwards;
      pointer-events:none;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);

    onClick?.(e);
  };

  return (
    <button
      ref={btnRef}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden",
        "inline-flex items-center justify-center font-medium rounded-lg",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "active:scale-95",
        "hover:-translate-y-px",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}

      {/* Ripple keyframe injected once */}
      <style>{`
        @keyframes btn-ripple {
          to { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </button>
  );
}

export default Button;
