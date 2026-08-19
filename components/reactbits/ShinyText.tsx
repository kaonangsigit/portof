"use client";
// ReactBits - ShinyText
// Metallic sheen sweep across text
// Source: https://www.reactbits.dev/text-animations/shiny-text

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;         // animation speed in seconds
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = "",
}: ShinyTextProps) {
  return (
    <span
      className={`shiny-text inline-block ${disabled ? "" : "shiny-text--animated"} ${className}`}
      style={
        {
          "--shiny-speed": `${speed}s`,
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
}
