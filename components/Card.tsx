import clsx from "clsx";
// import {
//   PrismicNextImage,
//   PrismicNextLink,
//   PrismicNextLinkProps,
// } from "@prismicio/next";
import Pill from "./Pill";
import Button from "./Button";
import Heading from "./Heading";

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  size?: "md" | "lg";
  buttonCta?: string;
  variant?: "featured" | "primary";
  title: string;
  description: string;
  category: string;
  date: string;
  featuredText?: string;
}

export default function Card({
  className,
  size = "lg",
  buttonCta = "Read More",
  variant = "primary",
  title,
  description,
  category,
  date,
  featuredText = "Featured",
}: CardProps) {
  return (
    <div
      className={clsx(
        "font-semibold rounded-lg inline-block",
        size === "lg" && "text-md px-3 py-3.5",
        size === "md" && "text-sm px-2 py-2.5",
        className,
      )}
    >
      <div>
        <div>
          {/* <PrismicNextImage /> */}
        </div>
        <div className="mb-2">
          {variant === "primary" ? (
            <>
              <Pill variant="category" size="md">
                {category}
              </Pill>
              <div>{date}</div>
            </>
          ) : (
            <>
              <Pill variant="featured" size="lg">
                {featuredText}
              </Pill>
              <div>{category}</div>
            </>
          )}
        </div>
        <Heading size="md" className="mb-2">
          {title}
        </Heading>
        <div className="mb-4 text-gray-600">{description}</div>
        <Button variant="primary" href="/blog">
          {buttonCta}
        </Button>
      </div>
    </div>
  );
}
