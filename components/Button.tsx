"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type ButtonProps = {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
  href: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  variant = "primary",
  href,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={clsx(
        "flex items-center gap-4 w-fit transition-colors duration-200 ease-in-out py-1.5 pl-4 pr-1.5",
        variant === "primary" &&
          "bg-transparent border border-gray-200 rounded-sm text-xs uppercase hover:bg-gray-100",
        className,
      )}
      {...rest}
    >
      <span className="font-medium">{children}</span>
      <div className="bg-moss-green p-1.5">
        <ArrowRight size={18} className="text-black" />
      </div>
    </button>
  );
}
