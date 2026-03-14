import { render, screen } from "@testing-library/react";
import BlogBody from "./index";
import { PrismicRichText } from "@prismicio/react";
import { blogComponents } from "@/styles/blog/constants";
import { createBlogBodySlice } from "@/tests/helpers/fixtures";

jest.mock("@prismicio/react");

describe("BlogBody Slice", () => {
  const slice = createBlogBodySlice({ content: "Hello world" });

  it("renders PrismicRichText", () => {
    render(<BlogBody slice={slice} index={0} slices={[]} context={undefined} />);
    expect(screen.getByTestId("prismic-rich-text")).toBeInTheDocument();
  });

  it("passes the content field to PrismicRichText", () => {
    render(<BlogBody slice={slice} index={0} slices={[]} context={undefined} />);
    expect((PrismicRichText as jest.Mock).mock.calls[0][0]).toMatchObject({
      field: slice.primary.content,
    });
  });

  it("passes blogComponents to PrismicRichText", () => {
    render(<BlogBody slice={slice} index={0} slices={[]} context={undefined} />);
    expect((PrismicRichText as jest.Mock).mock.calls[0][0]).toMatchObject({
      components: blogComponents,
    });
  });

  it("sets data-slice-type on the root element", () => {
    const { container } = render(
      <BlogBody slice={slice} index={0} slices={[]} context={undefined} />,
    );
    expect(container.querySelector("section")).toHaveAttribute(
      "data-slice-type",
      "article_body",
    );
  });

  it("sets data-slice-variation on the root element", () => {
    const { container } = render(
      <BlogBody slice={slice} index={0} slices={[]} context={undefined} />,
    );
    expect(container.querySelector("section")).toHaveAttribute(
      "data-slice-variation",
      "default",
    );
  });

  it("renders without crashing when content is an empty array", () => {
    const emptySlice = createBlogBodySlice({ contentNodes: [] });
    expect(() =>
      render(<BlogBody slice={emptySlice} index={0} slices={[]} context={undefined} />),
    ).not.toThrow();
  });
});
