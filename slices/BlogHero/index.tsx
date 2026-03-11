import { FC } from "react";
import { Content, isFilled, asDate } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicImage,
  SliceComponentProps,
} from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import Bounded from "@/components/Bounded";
import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import { blogComponents } from "@/styles/blog/constants";
/**
 * Props for `ArticleHeader`.
 */
export type BlogHeroProps = SliceComponentProps<Content.ArticleHeaderSlice>;
/**
 * Component for "Article Header" Slices.
 */
const BlogHero: FC<BlogHeroProps> = ({ slice }) => {
  const author = slice.primary.author;
  const category = slice.primary.blog_category;
  const date = asDate(slice.primary.published_date) || Date();
  const formattedDate = new Date(date)
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Breadcrumbs
        categoryName={
          isFilled.contentRelationship(category)
            ? (category.data?.name as string)
            : undefined
        }
        categoryUid={
          isFilled.contentRelationship(category) ? category.uid : undefined
        }
        categoryParamName="category"
        className="text-sm mb-4"
      />
      <PrismicRichText
        field={slice.primary.title}
        components={blogComponents}
      />
      <div>
        {isFilled.contentRelationship(author) && author.data && (
          <div className="flex justify-between">
            <div className="flex items-end">
              <PrismicImage
                field={author.data.avatar}
                className="w-12 h-12 rounded-full mr-4"
                imgixParams={{
                  ar: "1:1",
                  fit: "crop",
                  auto: ["format", "compress"],
                  q: 80,
                }}
              />
              <div>
                <div className="text-sm text-gray-400 font-medium">
                  Written By
                </div>
                <div className="text-sm font-medium">{author.data.name}</div>
              </div>
            </div>
            <div className="flex items-end gap-4 text-xs text-gray-400 font-semibold">
              <span className="uppercase">
                {isFilled.contentRelationship(category) && category.data?.name}
              </span>
              <span className="uppercase">{formattedDate}</span>
              <span className="uppercase">
                {slice.primary.reading_time} MIN READ
              </span>
            </div>
          </div>
        )}
      </div>
      <PrismicNextImage
        field={slice.primary.header_image}
        className="w-full h-auto rounded-lg mt-6"
        preload
        loading="eager"
        imgixParams={{
          ar: "2:1",
          fit: "crop",
          auto: ["format", "compress"],
          q: 80,
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
      />
    </Bounded>
  );
};

export default BlogHero;
