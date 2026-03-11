import clsx from "clsx";

export interface PillProps {
  as?: "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | React.ElementType;
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" ;
  variant?: "featured" | "category"
}

export default function Pill({
  as: Comp = "div",
  className,
  children,
  size = "lg",
  variant = "category",
}: PillProps) {
  return (
    <Comp
      className={clsx(
        "font-semibold rounded-lg inline-block",
        size === "lg" && "text-md px-3 py-3.5",
        size === "md" && "text-sm px-2 py-2.5",
        size === "sm" && "text-xs px-1 py-1.5",
        variant === "featured" && "bg-blue-400 text-white",
        variant === "category" && "bg-cyan-300 text-blue-600",
        className,
      )}
    >
      {children}
    </Comp>
  );
}