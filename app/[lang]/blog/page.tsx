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
import BlogCarousel from "./_components/BlogCarousel";
import { getLocales } from "@/utils/getLocales";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "@/lib/i18n";

export const revalidate = 500;
const PAGE_SIZE = 3;
const AUTOPLAY_DELAY = 5000;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
  params: Promise<{ lang: string }>;
}) {
  const client = createClient();
  const [searchParams, { lang }] = await Promise.all([
    props.searchParams,
    props.params,
  ]);
  const pagination = searchParams.page ? Number(searchParams.page) : 1;
  const category = searchParams.category as string | undefined;

  const page = await client
    .getSingle("blog_home", { lang })
    .catch(() => notFound());
  const categories = await client.getAllByType("category", { lang });
  const t = getTranslations(lang);
  const blogPosts = await getBlogPosts(PAGE_SIZE, pagination, category, lang);
  const locales = await getLocales(page, client);

  return (
    <main className="bg-gray-100 overflow-x-hidden">
      <nav className="mx-2 md:mx-auto mt-2 lg:mt-4 max-w-5xl">
        <LanguageSwitcher locales={locales} />
      </nav>
      <section className="mx-2 md:mx-auto mt-4 lg:mt-12 max-w-5xl">
        <div className="block gap-2 lg:flex lg:justify-between">
          <PrismicRichText
            field={page.data.title}
            components={blogComponents}
          />
          <div className="hidden lg:block">
            <PrismicRichText field={page.data.caption} />
          </div>
        </div>
        {page.data.featured_blogs && (
          <div className="w-full mt-4 lg:mt-8">
            <BlogCarousel
              featuredBlogs={page.data.featured_blogs}
              slidesPerPage={1.1}
              spacing="16px"
              autoplay={{ delay: AUTOPLAY_DELAY }}
              buttonCta={t.blog.cta}
            />
          </div>
        )}
      </section>
      <section className="mx-2 md:mx-auto m-12 max-w-5xl">
        <div className="mb-6">
          <PrismicRichText
            field={page.data.pagination_title}
            components={blogComponents}
          />
          <div className="mb-4 lg:mb-12">
            <Suspense
              fallback={
                <div className="h-10.5 w-48 animate-pulse bg-gray-200 rounded-md" />
              }
            >
              <CategorySelectClient
                categories={categories}
                placeholder={t.blog.categoriesPlaceholder}
                allLabel={t.blog.allCategories}
              />
            </Suspense>
          </div>
          {blogPosts.results_size > 0 ? (
            <BlogList blogPosts={blogPosts} lang={lang} />
          ) : (
            <>{t.blog.noResults}</>
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
  params,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const [sParams, { lang }] = await Promise.all([searchParams, params]);
  const client = createClient();
  const page = await client
    .getSingle("blog_home", { lang })
    .catch(() => notFound());
  const settings = await client.getSingle("global_settings");
  const locales = await getLocales(page, client);

  const hreflangLinks = Object.fromEntries(
    locales
      .filter((l) => l.url)
      .map((l) => [l.lang, `${process.env.NEXT_PUBLIC_SITE_URL}${l.url}`]),
  );
  const xDefault = locales.find((l) => l.lang === "en-us");

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

  const blogPosts = await getBlogPosts(PAGE_SIZE, currentPage, category, lang);
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
      languages: {
        ...hreflangLinks,
        "x-default": xDefault
          ? `${process.env.NEXT_PUBLIC_SITE_URL}${xDefault.url}`
          : `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
      },
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
