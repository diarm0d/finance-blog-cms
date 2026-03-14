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
        "font-semibold rounded-sm inline-block",
        size === "lg" && "text-md px-3.5 py-3",
        size === "md" && "text-xs px-2.5 py-1.5",
        size === "sm" && "text-xs px-1.5 py-1",
        variant === "featured" && "bg-blue-400 text-white",
        variant === "category" && "bg-blue-100 text-blue-600",
        className,
      )}
    >
      {children}
    </Comp>
  );
}