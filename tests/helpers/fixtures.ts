import type { RichTextField, ImageField } from "@prismicio/client";
import * as prismic from "@prismicio/client";
import type { BlogHeroProps } from "@/slices/BlogHero";
import type { BlogBodyProps } from "@/slices/BlogBody";
import type { CategoryDocument } from "@/prismicio-types";

export const filledAuthor = {
  link_type: "Document" as const,
  id: "author-id",
  type: "author" as const,
  tags: [] as string[],
  lang: "en-us",
  uid: null,
  data: {
    name: "Henry Bewicke",
    avatar: {
      url: "https://example.com/avatar.jpg",
      alt: "Henry Bewicke avatar",
      dimensions: { width: 100, height: 100 },
      copyright: null,
    },
    position: "Senior Content Lead",
  },
};

export const filledCategory = {
  link_type: "Document" as const,
  id: "category-id",
  type: "category" as const,
  tags: [] as string[],
  lang: "en-us",
  uid: null,
  data: {
    name: "Banking & Finance",
  },
};

export const unfilledRelationship = {
  link_type: "Any" as const,
};

type BlogHeroOverrides = {
  author?: typeof filledAuthor | typeof unfilledRelationship;
  category?: typeof filledCategory | typeof unfilledRelationship;
  title?: string;
  publishedDate?: string;
  readingTime?: string;
  variation?: string;
};

export function createBlogHeroSlice(overrides: BlogHeroOverrides = {}): BlogHeroProps["slice"] {
  const {
    author = filledAuthor,
    category = filledCategory,
    title = "Test Article Title",
    publishedDate = "2024-03-14",
    readingTime = "5",
    variation = "default",
  } = overrides;

  return {
    slice_type: "article_header",
    slice_label: null,
    variation,
    version: "skw",
    id: "test-hero-id",
    primary: {
      title: [{ type: "heading1", text: title, spans: [] }],
      header_image: {
        url: "https://example.com/header.jpg",
        alt: "Test header image",
        dimensions: { width: 1200, height: 600 },
        copyright: null,
      },
      author,
      blog_category: category,
      published_date: publishedDate,
      reading_time: readingTime,
    },
    items: [],
  } as unknown as BlogHeroProps["slice"];
}

type BlogBodyOverrides = {
  content?: string;
  contentNodes?: RichTextField;
  variation?: string;
};

export function createBlogBodySlice(overrides: BlogBodyOverrides = {}): BlogBodyProps["slice"] {
  const { content = "This is a test paragraph.", contentNodes, variation = "default" } = overrides;

  return {
    slice_type: "article_body",
    slice_label: null,
    variation,
    version: "skw",
    id: "test-body-id",
    primary: {
      content: contentNodes ?? [{ type: "paragraph", text: content, spans: [] }],
    },
    items: [],
  } as unknown as BlogBodyProps["slice"];
}

// ─── Blog post / query fixtures ──────────────────────────────────────────────

type BlogPostOverrides = {
  id?: string;
  uid?: string;
  title?: string;
  snippet?: string;
  category?: typeof filledCategory | typeof unfilledRelationship;
  metaImage?: ImageField;
  firstPublicationDate?: string;
};

export function createBlogPost(overrides: BlogPostOverrides = {}): prismic.Content.BlogPageDocument {
  const {
    id = "post-id-1",
    uid = "test-post",
    title = "Test Blog Post",
    snippet = "Test snippet for the blog post.",
    category = filledCategory,
    metaImage = {
      url: "https://example.com/meta.jpg",
      alt: "Test meta image",
      dimensions: { width: 1200, height: 630 },
      copyright: null,
    } as ImageField,
    firstPublicationDate = "2024-03-14T12:00:00+0000",
  } = overrides;

  return {
    id,
    uid,
    type: "blog_page",
    href: "https://finance-blog.cdn.prismic.io/api/v2/documents/search",
    tags: [],
    slugs: [uid],
    linked_documents: [],
    lang: "en-us",
    alternate_languages: [],
    first_publication_date: firstPublicationDate,
    last_publication_date: firstPublicationDate,
    data: {
      title,
      snippet,
      meta_image: metaImage,
      category,
    },
  } as unknown as prismic.Content.BlogPageDocument;
}

export function createBlogQuery(
  posts: prismic.Content.BlogPageDocument[] = [createBlogPost()],
): prismic.Query<prismic.Content.BlogPageDocument> {
  return {
    page: 1,
    results_per_page: 10,
    results_size: posts.length,
    total_results_size: posts.length,
    total_pages: 1,
    next_page: null,
    prev_page: null,
    results: posts,
  } as unknown as prismic.Query<prismic.Content.BlogPageDocument>;
}

export function createCategoryDocument(name: string, uid: string): CategoryDocument<string> {
  return {
    id: `category-${uid}`,
    uid,
    type: "category",
    href: "",
    tags: [],
    slugs: [uid],
    linked_documents: [],
    lang: "en-us",
    alternate_languages: [],
    first_publication_date: "2024-01-01T00:00:00+0000",
    last_publication_date: "2024-01-01T00:00:00+0000",
    data: { name },
  } as unknown as CategoryDocument<string>;
}
