// lib/prismic/blog.ts
import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";

export type BlogCategory = "engineering" | "product" | "culture"; // adapt to your slices/model

export type BlogListingParams = {
  page?: number;              // page index starting at 1
  pageSize?: number;          // default 3
  category?: string;    // optional: when omitted, all categories
};

export async function getBlogPosts({
  page = 1,
  pageSize = 3,
  category,
}: BlogListingParams) {
  const client = createClient();

  const filters: string[] = [
    prismic.filter.at("document.type", "blog_page"),
  ];

  if (category) {
    // Adjust field path to match your Prismic custom type
    // e.g. "my.blog_post.category" for a Select field
    filters.push(prismic.filter.at("my.blog_post.category", category));
  }

  const res = await client.get({
    filters,
    page,
    pageSize,
    orderings: {
      field: "my.blog_post.published_at", // or first_publication_date
      direction: "desc",
    },
  });

  return {
    posts: res.results,
    pagination: {
      page: res.page,
      pageSize: res.results_per_page,
      totalPages: res.total_pages,
      totalResults: res.total_results_size,
      hasNextPage: res.page < res.total_pages,
      hasPrevPage: res.page > 1,
    },
  };
}
