import { isFilled } from "@prismicio/client";
import { Carousel } from "@/components/Carousel";
import Card from "@/components/Card";
import { type BlogHomeDocumentData } from "@/prismicio-types";
import { type CarouselRootProps } from "@ark-ui/react/carousel";

type Props = {
  featuredBlogs: BlogHomeDocumentData["featured_blogs"];
  buttonCta?: string;
} & Omit<CarouselRootProps, "children" | "slideCount">;

export default function BlogCarousel({ featuredBlogs, buttonCta, ...carouselProps }: Props) {
  return (
    <Carousel {...carouselProps}>
      {featuredBlogs.map((item, index) => {
        if (!isFilled.contentRelationship(item.featured)) return null;
        const post = item.featured;
        const categoryName = isFilled.contentRelationship(post.data?.category)
          ? post.data.category.data?.name
          : "Uncategorized";
        return (
          <Card
            key={index}
            title={post.data?.title ?? ""}
            description={post.data?.snippet ?? ""}
            category={categoryName ?? "Uncategorized"}
            image={post.data?.meta_image}
            href={post.url ?? ""}
            date=""
            variant="featured"
            buttonCta={buttonCta}
          />
        );
      })}
    </Carousel>
  );
}
