use client";
import Link from "next/link";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

type Props = {
  category?: string;
  categoryParamName?: string;
  className?: string;
};

export function Breadcrumbs({
  category,
  categoryParamName,
  className,
  ...rest
}: Props) {
  const crumbs = useBreadcrumbs({
    category,
    categoryParamName: "category",
    labels: {
      blog: "Overview",
    },
  });

  return (
    <nav aria-label="Breadcrumb" {...rest} className={clsx(className)}>
      <ol className="flex gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          if (isLast && category && categoryParamName) {
            const prevCrumb = crumbs[index - 1];
            const baseHref = prevCrumb ? prevCrumb.href : crumb.href;

            const search = new URLSearchParams({
              [categoryParamName]: category,
            }).toString();

            const categoryHref = `${baseHref}?${search}`;

            return (
              <li
                key={crumb.href}
                className="flex items-center gap-2 hover:text-gray-600"
              >
                <Link href={categoryHref}>{category}</Link>
              </li>
            );
          }

          return (
            <li
              key={crumb.href}
              className={clsx("flex items-center gap-2 hover:text-gray-600", {
                "text-gray-400": !crumb.isLast,
              })}
            >
              {!crumb.isLast ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
              {!crumb.isLast && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}