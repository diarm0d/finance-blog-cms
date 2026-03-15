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
  category?: string;
  categoryParamName?: string;
  excludeSegments?: string[];
};

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}): Crumb[] {
  const { labels = {}, category, categoryParamName = 'category', excludeSegments = [] } = options
  const pathname = usePathname()

  return useMemo(() => {
    if (!pathname) return []

    const segments = pathname.split('/').filter(Boolean).filter(s => !excludeSegments.includes(s))

    const crumbs: Crumb[] = []

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1

      let href = '/' + segments.slice(0, index + 1).join('/')

      if (isLast && category) {
        const search = new URLSearchParams({
          [categoryParamName]: category,
        }).toString()
        href = `${href}?${search}`
      }

      const baseLabel = labels[segment] ?? segment.replace(/-/g, ' ')

      const label =
        isLast && category ? category : capitalize(baseLabel)

      crumbs.push({ label, href, isLast })
    })

    return crumbs
  }, [pathname, labels, category, categoryParamName, excludeSegments])
}