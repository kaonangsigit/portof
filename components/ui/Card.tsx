import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        "dark:border-gray-700 dark:bg-gray-900",
        hover && "transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardSectionProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-gray-200 dark:border-gray-700",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
