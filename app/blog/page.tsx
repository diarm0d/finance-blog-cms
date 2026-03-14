import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";
import { blogComponents } from "@/styles/blog/constants";
import BlogPaginationClient from "./_components/BlogPaginationClient";
import { getBlogPosts } from "@/lib/prismic";
import { CategorySelectClient } from "./_components/CategorySelectClient";
import { Suspense } from "react";
import BlogList from "./_components/BlogList";
import { asImageSrc, asText } from "@prismicio/client";

export const revalidate = 600;
const PAGE_SIZE = 3;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const client = createClient();
  const searchParams = await props.searchParams;
  const pagination = searchParams.page ? Number(searchParams.page) : 1;
  const category = searchParams.category as string | undefined;

  const page = await client.getSingle("blog_home").catch(() => notFound());
  const categories = await client.getAllByType("category");
  const blogPosts = await getBlogPosts(PAGE_SIZE, pagination, category);


  return (
    <main className="bg-gray-100">
      <section className="mx-2 md:mx-auto mt-12 max-w-5xl">
        <div className="flex justify-between">
          <PrismicRichText
            field={page.data.title}
            components={blogComponents}
          />
          <PrismicRichText field={page.data.caption} />
          {/*TO DO: Carosel comp goes here mapping out page.data.featured_blogs with CARD comp size lg */}
        </div>
      </section>
      <section className="mx-2 md:mx-auto mt-8 max-w-5xl">
        <div>
          <PrismicRichText
            field={page.data.pagination_title}
            components={blogComponents}
          />
          <Suspense
            fallback={
              <div className="h-10.5 mb-4 w-48 animate-pulse bg-gray-200 rounded-md" />
            }
          >
            <CategorySelectClient
              categories={categories}
              placeholder="Categories"
            />
          </Suspense>
          {blogPosts.results_size > 0 ? (
            <BlogList blogPosts={blogPosts} />
          ) : (
            <>No blogs on this topic</>
          )}
          <BlogPaginationClient
            pageSize={PAGE_SIZE}
            count={blogPosts.total_results_size}
          />
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}): Promise<Metadata> {
  const sParams = await searchParams;
  const client = createClient();
  const page = await client.getSingle("blog_home").catch(() => notFound());
  const settings = await client.getSingle("global_settings");

  const currentPage = Number(sParams.page) || 1;
  const category = sParams.category as string | undefined;

  const rawImage =
    asImageSrc(page.data.meta_image) || asImageSrc(settings.data.site_image);
  const ogImage = rawImage
    ? `${rawImage}&w=1200&h=630&fit=crop&q=80`
    : undefined;

  const title =
    page.data.meta_title ||
    asText(page.data.title) ||
    settings.data.site_title ||
    "Moss | The Finance Operating System";
  const description =
    page.data.meta_description || settings.data.site_description || undefined;

  const blogPosts = await getBlogPosts(PAGE_SIZE, currentPage, category);
  const totalPages = blogPosts.total_pages;

  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog`;
  const categoryQuery = category ? `&category=${category}` : "";

  const otherLinks: Record<string, string> = {};

  if (currentPage > 1) {
    const prevPage = currentPage - 1;
    otherLinks["prev"] = `${baseUrl}?page=${prevPage}${categoryQuery}`;
  }

  if (currentPage < totalPages) {
    const nextPage = currentPage + 1;
    otherLinks["next"] = `${baseUrl}?page=${nextPage}${categoryQuery}`;
  }
  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    },
    openGraph: {
      title,
      description,
      siteName: settings.data.site_title || "Moss",
      locale: page.lang,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
      creator: "@getmoss",
    },
    other: {
      ...otherLinks,
      citation_title: title,
      citation_author: "Moss Team",
      citation_publication_date: page.first_publication_date,
      citation_online_date: page.last_publication_date,
    },
  };
}
