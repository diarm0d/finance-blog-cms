import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";

export async function getBlogPosts(
  pagesize?: number,
  pagination?: number,
  category?: string,
): Promise<prismic.Query<prismic.Content.BlogPageDocument>> {
  const client = createClient({
    fetchOptions: { cache: "no-store" },
  });

  const filters = [
    // Ensure we only get blog posts
    prismic.filter.at("document.type", "blog_page"),
  ];

  if (category && category !== "all") {
    // 1. Fetch the category document to get its internal Prismic ID
    const categoryDoc = await client.getByUID("category", category);

    if (categoryDoc) {
      // 2. Filter using the ID (e.g., "abGrqxIAACEAFuqM")
      filters.push(prismic.filter.at("my.blog_page.category", categoryDoc.id));
    }
  }

  const blogPosts = await client.get({
    filters,
    pageSize: pagesize,
    page: pagination,
    // This tells Prismic to "join" the category data so we have the name/label
    fetchLinks: ["category.name", "category.uid"],
    orderings: {
      field: "document.first_publication_date",
      direction: "desc",
    },
  });

  return blogPosts as prismic.Query<prismic.Content.BlogPageDocument>;
}
