import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { asLink, isFilled, asImageSrc } from "@prismicio/client";
import { getLocales } from "@/utils/getLocales";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Bounded from '@/components/Bounded';



type Params = { uid: string; lang: string };

export default async function BlogPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid, lang } = await params;
  const client = createClient();
  const page = await client
    .getByUID("blog_page", uid, {
      lang,
      fetchLinks: ["category.name", "category.uid,"],
    })
    .catch(() => notFound());

  const settings = await client.getSingle("global_settings");

  const locales = await getLocales(page, client);

  const title =
    page.data.meta_title ||
    page.data.title ||
    settings.data.site_title ||
    "Moss | The Finance Operating System";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: title,
        datePublished: page.first_publication_date,
        author: {
          "@type": "Organization",
          name: "Moss",
          url: "https://getmoss.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Moss",
          logo: { "@type": "ImageObject", url: "https://getmoss.com/logo.png" },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Bounded>
        <LanguageSwitcher locales={locales} />
      </Bounded>
      <SliceZone slices={page.data.slices} components={components} context={{ lang }} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid, lang } = await params;
  const client = createClient();
  const page = await client.getByUID("blog_page", uid, { lang });
  const settings = await client.getSingle("global_settings");
  const locales = await getLocales(page, client);

  const hreflangLinks = Object.fromEntries(
    locales.filter((l) => l.url).map((l) => [l.lang, `${process.env.NEXT_PUBLIC_SITE_URL}${l.url}`])
  );
  const xDefault = locales.find((l) => l.lang === "en-us");

  const rawImage =
    asImageSrc(page.data.meta_image) || asImageSrc(settings.data.site_image);
  const ogImage = rawImage
    ? `${rawImage}&w=1200&h=630&fit=crop&q=80`
    : undefined;

  const title =
    page.data.meta_title ||
    page.data.title ||
    settings.data.site_title ||
    "Moss | The Finance Operating System";
  const description =
    page.data.meta_description || settings.data.site_description || undefined;

  const authorName =
    (isFilled.contentRelationship(page.data.author) &&
      page.data.author.data?.name) ||
    "Moss Team";
  const categoryName =
    (isFilled.contentRelationship(page.data.category) &&
      page.data.category.data?.name) ||
    "Finance";

  const canonicalUrl =
    asLink(page.data.canonical) ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${uid}`;

  return {
    title,
    description,
    robots: {
      index: page.data.index ?? true,
      follow: page.data.follow ?? true,
      googleBot: {
        index: page.data.index ?? true,
        follow: page.data.follow ?? true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...hreflangLinks,
        "x-default": xDefault ? `${process.env.NEXT_PUBLIC_SITE_URL}${xDefault.url}` : canonicalUrl,
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
      type: "article",
      publishedTime: page.first_publication_date,
      authors: [authorName],
      tags: [categoryName, "Fintech", "Spend Management"],
      section: "Finance Guides",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
      creator: "@getmoss",
    },
    other: {
      citation_title: title,
      citation_author: authorName,
      citation_publication_date: page.first_publication_date,
      citation_online_date: page.last_publication_date,
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("blog_page");

  return pages.map((page) => ({ uid: page.uid, lang: page.lang }));
}
