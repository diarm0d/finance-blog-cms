"use client";
import { useState } from "react";
import { Carousel as CarouselArk } from "@ark-ui/react/carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { isFilled } from "@prismicio/client";
import { Content } from "@prismicio/client";
import clsx from "clsx";
import Card from "./Card";

type Props = {
  featuredBlogs: Content.BlogHomeDocumentDataFeaturedBlogsItem[];
};

const AUTOPLAY_DELAY = 5000;

export const Carousel = ({ featuredBlogs }: Props) => {
  const filled = featuredBlogs.filter((item) =>
    isFilled.contentRelationship(item.featured),
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="overflow-hidden">
      <CarouselArk.Root
        className="w-full"
        slideCount={filled.length}
        slidesPerPage={1.2}
        spacing="16px"
        autoplay={{ delay: AUTOPLAY_DELAY }}
        loop
        onIndexChange={({ index }: { index: number }) => setCurrentIndex(index)}
      >
        <CarouselArk.Context>
          {(api) => (
            <>
              <CarouselArk.ItemGroup>
                {filled.map((blog, index) => {
                  if (!isFilled.contentRelationship(blog.featured)) return null;
                  const post = blog.featured;
                  const categoryName = isFilled.contentRelationship(
                    post.data?.category,
                  )
                    ? post.data.category.data?.name
                    : "Uncategorized";

                  return (
                    <CarouselArk.Item
                      key={index}
                      index={index}
                      className={clsx(
                        "transition-all duration-500",
                        currentIndex !== index && "opacity-40 pointer-events-none",
                      )}
                    >
                      <Card
                        title={post.data?.title ?? ""}
                        description={post.data?.snippet ?? ""}
                        category={categoryName ?? "Uncategorized"}
                        image={post.data?.meta_image}
                        href={post.url ?? ""}
                        date=""
                        variant="featured"
                      />
                    </CarouselArk.Item>
                  );
                })}
              </CarouselArk.ItemGroup>
              <div className="flex justify-center items-center mt-4 gap-12">
                <CarouselArk.PrevTrigger>
                  <ArrowLeftIcon />
                </CarouselArk.PrevTrigger>
                <CarouselArk.IndicatorGroup className="flex gap-2">
                  {api.pageSnapPoints.map((_, index) => (
                    <CarouselArk.Indicator
                      key={index}
                      index={index}
                      className="group relative h-2 w-2 overflow-hidden rounded-full bg-gray-200 transition-[width] duration-300 data-current:w-8"
                    >
                      <span className="absolute inset-0 rounded-full bg-moss-green translate-x-full group-data-current:animate-indicator-fill" />
                    </CarouselArk.Indicator>
                  ))}
                </CarouselArk.IndicatorGroup>
                <CarouselArk.NextTrigger>
                  <ArrowRightIcon />
                </CarouselArk.NextTrigger>
              </div>
            </>
          )}
        </CarouselArk.Context>
      </CarouselArk.Root>
    </div>
  );
};
