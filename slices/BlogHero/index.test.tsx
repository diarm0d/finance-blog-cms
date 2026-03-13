import { render, screen } from "@testing-library/react";
import BlogHero, { BlogHeroProps } from "./index";
import mock from "./mocks.json";

// Mock Prismic components to render simple HTML tags
jest.mock("@prismicio/next", () => ({
  PrismicNextImage: ({ field }: { field: any }) => (
    <img alt={field?.alt} src={field?.url} />
  ),
}));

jest.mock("@prismicio/react", () => ({
  PrismicRichText: ({ field }: { field: any }) => {
    // Navigate the nested mock structure
    const nodes = Array.isArray(field) ? field : field?.value || [];
    return (
      <div>
        {nodes.map((n, i) => (
          <h1 key={i}>{n.content?.text || n.text}</h1>
        ))}
      </div>
    );
  },
}));

jest.mock("@/components/Breadcrumbs/Breadcrumbs", () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs" />,
}));

describe("BlogHero Slice", () => {
  const rawMock = mock[0];
  const slice = rawMock as unknown as BlogHeroProps["slice"];

  it("should render the title correctly", () => {
    render(
      <BlogHero slice={slice} index={0} slices={[]} context={undefined} />,
    );

  
    const expectedTitle = rawMock.primary.title.value[0].content.text;
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it("should render the header image with alt text", () => {
    render(
      <BlogHero slice={slice} index={0} slices={[]} context={undefined} />,
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", rawMock.primary.header_image.alt);
    expect(image).toHaveAttribute("src", rawMock.primary.header_image.url);
  });

  it("should render the reading time", () => {
    render(
      <BlogHero slice={slice} index={0} slices={[]} context={undefined} />,
    );

    const readingTime = `${rawMock.primary.reading_time.value} MIN READ`;
    expect(screen.getByText(new RegExp(readingTime, "i"))).toBeInTheDocument();
  });

  it("should render the breadcrumbs", () => {
    render(
      <BlogHero slice={slice} index={0} slices={[]} context={undefined} />,
    );
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
  });
});
