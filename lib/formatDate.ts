import { asDate } from "@prismicio/client";

export function formatBlogDate(dateValue: string | null | undefined): string {
  const date = asDate(dateValue) || new Date();
  return new Date(date)
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}
