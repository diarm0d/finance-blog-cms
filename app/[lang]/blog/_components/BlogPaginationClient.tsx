"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";
import { Pagination } from "@/components/Pagination";


type BlogPageClientProps = {
  count:number
  pageSize: number;
};

function BlogPaginationClient({
  count,
  pageSize,
}: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (details: { page: number; pageSize: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", details.page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex w-full justify-center">
      <Pagination
        count={count}
        pageSize={pageSize}
        siblingCount={1}
        page={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default function BlogPageClient(props: BlogPageClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPaginationClient {...props} />
    </Suspense>
  );
}
