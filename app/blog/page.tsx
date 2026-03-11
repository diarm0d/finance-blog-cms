import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";

import { createClient } from "@/prismicio";
import BlogPaginationClient from "./BlogPaginationClient";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const client = createClient();
  const currentPage = Number(searchParams.page) || 1;
  const PAGE_SIZE = 3;
  const page = await client.getSingle("blog_home").catch(() => notFound());
  const settings = await client.getSingle("global_settings");
  const categories = await client.getAllByType("category");
  const blogPosts = await client.getByType("blog_page", {
    pageSize: PAGE_SIZE,
    page: currentPage,
    fetchLinks: ["category.name"],
  });

  return (
    <BlogPaginationClient
      initialPage={page}
      initialSettings={settings}
      initialBlogPosts={blogPosts}
      initialCategories={categories}
      pageSize={PAGE_SIZE}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("blog_home").catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}
