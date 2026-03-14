"use client";
import clsx from "clsx";
import { PrismicNextImage } from "@prismicio/next";
import Pill from "./Pill";
import Button from "./Button";
import Heading from "./Heading";
import { ImageField } from "@prismicio/client";
import Link from "next/link";
import React from "react";

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
  image?: ImageField;
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
        "font-semibold rounded-sm inline-block bg-white border border-gray-200 ease-in-out hover:bg-gray-50",
        size === "lg" && "text-md p-6 min-h-84",
        size === "md" && "text-sm px-2 py-2.5",
        className,
      )}
    >
      <div
        className={clsx(
          "grid grid-cols-1",
          variant === "featured" && "grid-cols-1 lg:grid-cols-3 gap-12",
        )}
      >
        <div
          className={clsx(
            "relative aspect-video w-full overflow-hidden bg-gray-200 mb-4",
            variant === "featured" && "hidden lg:block order-2 lg:col-span-2 mb-0",
          )}
        >
          <PrismicNextImage
            field={image}
            className="rounded-sm object-cover"
            fill
            imgixParams={{
              ar: "16:9",
              fit: "crop",
              auto: ["format", "compress"],
              q: 80,
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
          />
        </div>
        <div>
          <div className="mb-4">
            {variant === "primary" ? (
              <div className="flex items-center">
                <Pill variant="category" size="sm">
                  {category}
                </Pill>
                <div className="ml-4 text-sm text-gray-500">{date}</div>
              </div>
            ) : (
              <div className="flex items-baseline">
                <Pill variant="featured" size="md" className="uppercase">
                  {featuredText}
                </Pill>
                <div className="ml-2 uppercase text-xs text-gray-400 md:ml-4">
                  {category}
                </div>
              </div>
            )}
          </div>
          <div>
            <Heading
              size="md"
              className={clsx("text-lg mb-4", variant === "featured" && "mb-8")}
            >
              {title}
            </Heading>
            <div
              className={clsx(
                "mb-4 font-medium text-sm text-gray-500",
                variant === "featured" && "mb-4",
              )}
            >
              {description}
            </div>
            <div
              className={clsx(
                "relative aspect-video w-full overflow-hidden bg-gray-200 mb-4",
                variant === "featured" && "lg:hidden",
                variant === "primary" && "hidden",
              )}
            >
              <PrismicNextImage
                field={image}
                className="rounded-sm object-cover"
                fill
                imgixParams={{
                  ar: "16:9",
                  fit: "crop",
                  auto: ["format", "compress"],
                  q: 80,
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
              />
            </div>
            <Button variant="primary" href={href}>
              {buttonCta}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}