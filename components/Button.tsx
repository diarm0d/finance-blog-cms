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
        "block w-fit transition-colors duration-200 ease-in-out py-2 px-2",
        variant === "primary" &&
          "bg-transparent border-2 border-b-gray-200 hover:bg-cyan-800",
        className,
      )}
      href={href}
      {...rest}
    >
      {children}
      <div className="bg-[#B9FF3F] p-2">
        <ArrowRight size={24} />
      </div>
    </PrismicNextLink>
  );
}
