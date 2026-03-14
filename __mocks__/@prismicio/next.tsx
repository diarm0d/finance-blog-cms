import React from "react";

export const PrismicNextImage = jest.fn(({ field }: { field: any }) => (
  <img alt={field?.alt} src={field?.url} data-testid="prismic-next-image" />
));

export const PrismicNextLink = jest.fn(({ children, field, ...props }: any) => (
  <a href={field?.url} {...props}>
    {children}
  </a>
));
