import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";

export async function getBlogPosts(
  pagesize?: number,
  pagination?: number,
  category?: string,
  lang?: string,
): Promise<prismic.Query<prismic.Content.BlogPageDocument>> {
  const client = createClient({
    fetchOptions: { cache: "no-store" },
  });

  const filters = [
    prismic.filter.at("document.type", "blog_page"),
  ];

  if (category && category !== "all") {
    const categoryDoc = await client.getByUID("category", category);

    if (categoryDoc) {
      filters.push(prismic.filter.at("my.blog_page.category", categoryDoc.id));
    }
  }

  const blogPosts = await client.get({
    filters,
    lang,
    pageSize: pagesize,
    page: pagination,
    fetchLinks: ["category.name", "category.uid"],
    orderings: {
      field: "document.first_publication_date",
      direction: "desc",
    },
  });

  return blogPosts as prismic.Query<prismic.Content.BlogPageDocument>;
}
