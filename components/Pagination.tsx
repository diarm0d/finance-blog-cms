import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Pagination as PaginationArk } from '@ark-ui/react/pagination';


export const Pagination = () => (
  <PaginationArk.Root
    count={5000}
    pageSize={10}
    siblingCount={2}
  >
    <div>
      <PaginationArk.PrevTrigger>
        <ChevronLeftIcon />
      </PaginationArk.PrevTrigger>
      <PaginationArk.Context>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === "page" ? (
              <PaginationArk.Item key={index} {...page} >
                {page.value}
              </PaginationArk.Item>
            ) : (
              <PaginationArk.Ellipsis
                key={index}
                index={index}
              >
                &#8230;
              </PaginationArk.Ellipsis>
            ),
          )
        }
      </PaginationArk.Context>
      <PaginationArk.NextTrigger>
        <ChevronRightIcon />
      </PaginationArk.NextTrigger>
    </div>
  </PaginationArk.Root>
);
