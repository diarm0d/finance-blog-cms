"use client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

type Crumb = {
  label: string;
  href: string;
  isLast: boolean;
};

export type UseBreadcrumbsOptions = {
  labels?: Record<string, string>;
  categoryName?: string;
  categoryUid?: string;
  categoryParamName?: string;
};

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}): Crumb[] {
  const {
    labels = {},
    categoryName,
    categoryUid,
    categoryParamName = "category",
  } = options;
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname) return [];

    const segments = pathname.split("/").filter(Boolean);

    const crumbs: Crumb[] = [];

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;

      let href = "/" + segments.slice(0, index + 1).join("/");

      if (isLast && categoryUid) {
        const search = new URLSearchParams({
          [categoryParamName]: categoryUid,
        }).toString();
        href = `${href}?${search}`;
      }

      const baseLabel = labels[segment] ?? segment.replace(/-/g, " ");

      const label = isLast && categoryName ? categoryName : capitalize(baseLabel);

      crumbs.push({ label, href, isLast });
    });

    return crumbs;
  }, [pathname, labels, categoryName, categoryUid, categoryParamName]);
}