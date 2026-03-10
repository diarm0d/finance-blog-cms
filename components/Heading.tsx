import clsx from "clsx";

export interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Heading({
  as: Comp = "h1",
  className,
  children,
  size = "lg",
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        "font-medium",
        size === "xl" && "text-5xl md:text-7xl",
        size === "lg" && "text-2xl md:text-3xl",
        size === "md" && "text-1xl md:text-2xl",
        size === "sm" && "text-lg md:text-1xl",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
