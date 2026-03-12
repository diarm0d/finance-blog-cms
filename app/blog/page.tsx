import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";
import { blogComponents } from "@/styles/blog/constants";
import BlogPaginationClient from "./BlogPaginationClient";
import { getBlogPosts } from "@/lib/prismic";
import { CategorySelectClient } from "./CategorySelectClient";
import { Suspense } from "react";
import BlogList from "./BlogList";

export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const client = createClient();
  const searchParams = await props.searchParams;
  const pagination = searchParams.page ? Number(searchParams.page) : 1;
  const category = searchParams.category as string | undefined;
  const PAGE_SIZE = 3;

  const page = await client
    .getSingle("blog_home", {
      fetchLinks: [
        "blog_page.featured_blogs.featured.featured"
      ],
    })
    .catch(() => notFound());
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
          {/* Carosel comp goes here mapping out page.data.featured_blogs */}
        </div>
      </section>
      <section className="mx-2 md:mx-auto mt-8 max-w-5xl">
        <div>
          <PrismicRichText
            field={page.data.pagination_title}
            components={blogComponents}
            // className="mb-4 text-2xl font-semibold"
          />
          <Suspense
            fallback={<div className="h-10 w-48 animate-pulse bg-gray-200" />}
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
