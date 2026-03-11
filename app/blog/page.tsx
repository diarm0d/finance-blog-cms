import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc, isFilled } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";
import Card from "@/components/Card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const client = createClient();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const page = await client.getSingle("blog_home").catch(() => notFound());
  const settings = await client.getSingle("global_settings");
  const blogPosts = await client.getByType("blog_page", {
    pageSize: 3,
    page: currentPage,
    fetchLinks: ["category.name"],
  });

  console.log(page, settings, blogPosts);

  return (
    <main className="">
      <SliceZone slices={page.data.slices} components={components} />
      <h1>Hello World</h1>
      {/* 3. Render the Posts and Navigation */}
      <section className="grid grid-cols-3 gap-4">
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

        <nav className="pagination-controls">
          {blogPosts.prev_page && (
            <Link href={`/blog?page=${currentPage - 1}`}>Previous</Link>
          )}

          <span>
            Page {blogPosts.page} of {blogPosts.total_pages}
          </span>

          {blogPosts.next_page && (
            <Link href={`/blog?page=${currentPage + 1}`}>Next</Link>
          )}
        </nav>
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
