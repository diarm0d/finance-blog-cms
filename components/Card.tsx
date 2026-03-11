import clsx from "clsx";
import { PrismicNextImage } from "@prismicio/next";
import Pill from "./Pill";
import Button from "./Button";
import Heading from "./Heading";
import { ImageField } from "@prismicio/client";
import Link from "next/link";

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
  size?: "md" | "lg";
  buttonCta?: string;
  variant?: "featured" | "primary";
  title: string;
  description: string;
  category: string;
  date: string;
  featuredText?: string;
  href: string;
  image: ImageField;
}

export default function Card({
  className,
  size = "lg",
  buttonCta = "Read Story",
  variant = "primary",
  title,
  description,
  category,
  date,
  featuredText = "Featured",
  href,
  image,
}: CardProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "font-semibold rounded-sm inline-block bg-white border border-gray-200",
        size === "lg" && "text-md px-3 py-3.5",
        size === "md" && "text-sm px-2 py-2.5",
        className,
      )}
    >
      <div>
        <div className="mb-4">
          <PrismicNextImage field={image} className="rounded-sm" />
        </div>
        <div className="mb-4">
          {variant === "primary" ? (
            <div className="flex items-center">
              <Pill variant="category" size="sm">
                {category}
              </Pill>
              <div className="ml-4 text-sm text-gray-500">{date}</div>
            </div>
          ) : (
            <div className="flex justify-between items-baseline">
              <Pill variant="featured" size="md">
                {featuredText}
              </Pill>
              <div>{category}</div>
            </div>
          )}
        </div>
        <Heading size="md" className="text-lg mb-4">
          {title}
        </Heading>
        <div className="mb-4 font-medium text-sm text-gray-500">
          {description}
        </div>
        <Button variant="primary" href={href}>
          {buttonCta}
        </Button>
      </div>
    </Link>
  );
}
