"use client";
import { Children } from "react";
import { Carousel as CarouselArk, type CarouselRootProps } from "@ark-ui/react/carousel";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import clsx from "clsx";

type Props = Omit<CarouselRootProps, "slideCount">;

export const Carousel = ({ children, className, ...props }: Props) => {
  const slides = Children.toArray(children);

  return (
    <div className="">
      <CarouselArk.Root
        {...props}
        className={clsx(className)}
        slideCount={slides.length}
      >
        <CarouselArk.Context>
          {(api) => (
            <>
              <CarouselArk.ItemGroup>
                {slides.map((slide, index) => (
                  <CarouselArk.Item
                    key={index}
                    index={index}
                    className={clsx(
                      "transition-all duration-500",
                      api.page !== index && "opacity-40",
                    )}
                  >
                    {slide}
                  </CarouselArk.Item>
                ))}
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
                      className="relative h-2 w-2 overflow-hidden bg-gray-200 transition-[width] duration-300 data-current:w-8"
                    >
                      <span
                        key={api.page === index ? `active-${index}` : `inactive-${index}`}
                        className={clsx(
                          "absolute inset-0 bg-moss-green -translate-x-full",
                          api.page === index && "animate-indicator-fill",
                        )}
                      />
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
