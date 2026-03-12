"use client";
import clsx from "clsx";
import {
  Pagination as PaginationArk,
  type PaginationRootProps,
} from "@ark-ui/react/pagination";

export const Pagination = (props: PaginationRootProps) => (
  <PaginationArk.Root {...props}>
    <div>
      <PaginationArk.Context>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === "page" ? (
              <PaginationArk.Item
                key={index}
                {...page}
                className={clsx(
                  "text-xs rounded-sm p-2 ml-2",
                  page.value === pagination.page &&
                    "bg-black border border-black text-white",
                  page.value !== pagination.page &&
                    "bg-white text-black border border-gray-200 ",
                )}
              >
                {page.value < 10 ? `0` + page.value : page.value}
              </PaginationArk.Item>
            ) : (
              <PaginationArk.Ellipsis key={index} index={index}>
                &#8230;
              </PaginationArk.Ellipsis>
            ),
          )
        }
      </PaginationArk.Context>
    </div>
  </PaginationArk.Root>
);
