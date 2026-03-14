import React from "react";

export const PrismicRichText = jest.fn(({ field }: { field: any }) => {
  const nodes = Array.isArray(field) ? field : field?.value ?? [];
  return (
    <div data-testid="prismic-rich-text">
      {nodes.map((n: any, i: number) => (
        <span key={i}>{n.content?.text ?? n.text}</span>
      ))}
    </div>
  );
});

export const PrismicImage = jest.fn(({ field }: { field: any }) => (
  <img alt={field?.alt} src={field?.url} data-testid="prismic-image" />
));

export const PrismicLink = jest.fn(({ children, field, ...props }: any) => (
  <a href={field?.url} {...props}>
    {children}
  </a>
));
