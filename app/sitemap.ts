import { MetadataRoute } from "next";
import { createClient } from "@/prismicio";
import * as prismic from "@prismicio/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();
  const posts = await client.getAllByType("blog_page", {
    filters: [
      // Only fetch posts where 'index' is explicitly true
      prismic.filter.at("my.blog_page.index", true),
    ],
  });

  const postEntries = posts.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.uid}`,
    lastModified: new Date(post.last_publication_date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postEntries,
  ];
}
