import { FC } from "react";
import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  SliceComponentProps,
} from "@prismicio/react";
import  Bounded  from "@/components/Bounded";
import { blogComponents } from "@/styles/blog/constants";

/**
 * Props for `BlogBody`.
 */
export type BlogBodyProps = SliceComponentProps<Content.ArticleBodySlice>;

/**
 * Component for "BlogBody" Slices.
 */
const BlogBody: FC<BlogBodyProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PrismicRichText field={slice.primary.content} components={blogComponents} />
    </Bounded>
  );
};

export default BlogBody;
