import clsx from "clsx";
import { PrismicNextLink, PrismicNextLinkProps } from "@prismicio/next";
import { ArrowRight } from "lucide-react";

type ButtonProps = PrismicNextLinkProps & {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
  href: string;
};

export default function Button({
  variant = "primary",
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <PrismicNextLink
      className={clsx(
        "flex items-center gap-4 w-fit transition-colors duration-200 ease-in-out py-1.5 pl-4 pr-1.5",
        variant === "primary" &&
          "bg-transparent border border-gray-200 rounded-sm text-xs uppercase hover:bg-cyan-800",
        className,
      )}
      href={href}
      {...rest}
    >
      {children}
      <div className="bg-[#B9FF3F] p-1.5">
        <ArrowRight size={18} />
      </div>
    </PrismicNextLink>
  );
}
