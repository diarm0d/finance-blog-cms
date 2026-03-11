"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { isFilled, Query } from "@prismicio/client";
import { useEffect, useState, Suspense } from "react";

import { createClient } from "@/prismicio";
import Card from "@/components/Card";
import { Pagination } from "@/components/Pagination";
import {
  BlogHomeDocument,
  BlogPageDocument,
  CategoryDocument,
} from "@/prismicio-types";
import { Select } from "@/components/Select";
import { createListCollection } from "@ark-ui/react/select";

type BlogPageClientProps = {
  initialPage: BlogHomeDocument<string>;
  initialBlogPosts: Query<BlogPageDocument<string>>; 
  initialCategories: CategoryDocument[];
  pageSize: number;
};

function BlogPaginationClient({
  initialBlogPosts,
  initialCategories,
  pageSize,
}: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const selectedCategory = searchParams.get("category") || "all";

  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);

  const categoryOptions = [
    { label: "All", value: "all" },
    ...initialCategories.map((category) => ({
      label: category.data.name as string,
      value: category.uid,
    })),
  ];
  const collection = createListCollection({ items: categoryOptions });

  useEffect(() => {
    const client = createClient();
    const fetchData = async () => {
      const blogPostsData = await client.getByType("blog_page", {
        pageSize: pageSize,
        page: currentPage,
        fetchLinks: ["category.name"],
        filters: [
          selectedCategory !== "all"
            ? `at("my.blog_page.category", "${selectedCategory}")`
            : "",
        ].filter(Boolean),
      });
      setBlogPosts(blogPostsData);
    };

    if (
      currentPage !== initialBlogPosts.page ||
      selectedCategory !== (searchParams.get("category") || "all")
    ) {
      fetchData();
    }
  }, [
    currentPage,
    pageSize,
    initialBlogPosts.page,
    selectedCategory,
    searchParams,
  ]);

  const handlePageChange = (details: { page: number; pageSize: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", details.page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const handleCategoryChange = (details: { value: string[] }) => {
    const category = details.value[0];
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    params.set("page", "1");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <main className="bg-gray-100">
      <section className="mx-auto mt-12 max-w-5xl">
        <div className=" mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Latest Articles</h2>
          <Select
            collection={collection}
            placeholder="Categories"
            onValueChange={handleCategoryChange}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {blogPosts.results.map((post) => {
            const category =
              (isFilled.contentRelationship(post.data.category) &&
                post.data.category.data?.name) ||
              "Uncategorized";
            return (
              <Card
                key={post.id}
                title={post.data.title ?? ""}
                description={post.data.snippet ?? ""}
                category={category}
                date={new Date(post.first_publication_date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
                image={post.data.meta_image}
                href={`/blog/${post.uid}`}
              />
            );
          })}
        </div>
        <div className="mt-4 flex w-full justify-center">
          <Pagination
            count={blogPosts.total_results_size}
            pageSize={pageSize}
            siblingCount={3}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </main>
  );
}

export default function BlogPageClient(props: BlogPageClientProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPaginationClient {...props} />
    </Suspense>
  );
}
