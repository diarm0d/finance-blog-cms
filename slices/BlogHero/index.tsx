import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicImage,
  SliceComponentProps,
} from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import Bounded from "@/components/Bounded";
import { blogComponents } from "@/styles/blog/constants";

/**
 * Props for `ArticleHeader`.
 */
export type BlogHeroProps =
  SliceComponentProps<Content.ArticleHeaderSlice>;

/**
 * Component for "Article Header" Slices.
 */
const BlogHero: FC<BlogHeroProps> = ({ slice }) => {
  const author = slice.primary.author;
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
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
              />
              <div>
                <div className="text-sm text-gray-400 font-medium">
                  Written By
                </div>
                <div className="text-sm font-medium">{author.data.name}</div>
              </div>
            </div>
            <div className="flex items-end gap-4 text-xs text-gray-400 font-semibold">
              <span className="uppercase">{slice.primary.category}</span>
              <span className="uppercase">{slice.primary.published_date}</span>
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
      />
    </Bounded>
  );
};

export default BlogHero;
