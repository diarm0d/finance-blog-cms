import clsx from "clsx";

export interface GridProps {
  className?: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function Grid({
  className,
  children,
  size = "lg",
}: GridProps) {
  return (
    <div
      className={clsx(
        "grid",
        size === "xl" && "grid-cols-1 gap-4 md:grid-cols-2",
        size === "lg" && "grid-cols-1 gap-4 md:grid-cols-3",
        size === "md" && "grid-cols-1 gap-2 md:grid-cols-4",
        size === "sm" && "grid-cols-1 gap-2 md:grid-cols-5",
        size === "xs" && "grid-cols-1 gap-2 md:grid-cols-6",
        className,
      )}
    >
      {children}
    </div>
  );
}