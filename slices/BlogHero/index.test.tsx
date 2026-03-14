import { render, screen } from "@testing-library/react";
import BlogHero from "./index";
import { PrismicRichText } from "@prismicio/react";
import { Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs";
import {
  createBlogHeroSlice,
  unfilledRelationship,
} from "@/tests/helpers/fixtures";

jest.mock("@prismicio/react");
jest.mock("@prismicio/next");
jest.mock("@/components/Breadcrumbs/Breadcrumbs", () => ({
  Breadcrumbs: jest.fn(() => <div data-testid="breadcrumbs" />),
}));

const MockedBreadcrumbs = Breadcrumbs as jest.Mock;

describe("BlogHero Slice", () => {
  describe("title", () => {
    it("renders the title text via PrismicRichText", () => {
      const slice = createBlogHeroSlice({ title: "My Blog Post" });
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.getByText("My Blog Post")).toBeInTheDocument();
    });

    it("passes the title field and blogComponents to PrismicRichText", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect((PrismicRichText as jest.Mock).mock.calls[0][0]).toMatchObject({
        field: slice.primary.title,
      });
    });
  });

  describe("header image", () => {
    it("renders the header image with correct alt text and src", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      const img = screen.getByTestId("prismic-next-image");
      expect(img).toHaveAttribute("alt", "Test header image");
      expect(img).toHaveAttribute("src", "https://example.com/header.jpg");
    });
  });

  describe("reading time", () => {
    it("renders the reading time", () => {
      const slice = createBlogHeroSlice({ readingTime: "7" });
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.getByText(/7 MIN READ/i)).toBeInTheDocument();
    });
  });

  describe("breadcrumbs", () => {
    it("renders the Breadcrumbs component", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    });

    it("passes the category name to Breadcrumbs when filled", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(MockedBreadcrumbs.mock.calls[0][0]).toMatchObject({
        category: "Banking & Finance",
      });
    });

    it("passes undefined to Breadcrumbs when category is unfilled", () => {
      const slice = createBlogHeroSlice({ category: unfilledRelationship });
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(MockedBreadcrumbs.mock.calls[0][0].category).toBeUndefined();
    });
  });

  describe("author section", () => {
    it("renders author name when relationship is filled", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.getByText("Henry Bewicke")).toBeInTheDocument();
    });

    it("renders 'Written By' label when author is filled", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.getByText("Written By")).toBeInTheDocument();
    });

    it("renders author avatar when author is filled", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.getByTestId("prismic-image")).toHaveAttribute(
        "alt",
        "Henry Bewicke avatar",
      );
    });

    it("does not render the author block when relationship is unfilled", () => {
      const slice = createBlogHeroSlice({ author: unfilledRelationship });
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.queryByText("Written By")).not.toBeInTheDocument();
      expect(screen.queryByText("Henry Bewicke")).not.toBeInTheDocument();
    });
  });

  describe("category metadata", () => {
    it("renders category name in the metadata row when filled", () => {
      const slice = createBlogHeroSlice();
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      // Category appears inside the author block metadata row
      expect(screen.getByText(/banking & finance/i)).toBeInTheDocument();
    });

    it("does not render category metadata when author block is hidden", () => {
      const slice = createBlogHeroSlice({ author: unfilledRelationship });
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.queryByText(/banking & finance/i)).not.toBeInTheDocument();
    });
  });

  describe("published date", () => {
    it("renders the formatted date in the metadata row", () => {
      const slice = createBlogHeroSlice({ publishedDate: "2024-03-14" });
      render(<BlogHero slice={slice} index={0} slices={[]} context={{}} />);
      expect(screen.getByText("MARCH 14, 2024")).toBeInTheDocument();
    });
  });

  describe("slice data attributes", () => {
    it("sets data-slice-type on the root element", () => {
      const slice = createBlogHeroSlice();
      const { container } = render(
        <BlogHero slice={slice} index={0} slices={[]} context={{}} />,
      );
      expect(container.querySelector("section")).toHaveAttribute(
        "data-slice-type",
        "article_header",
      );
    });

    it("sets data-slice-variation on the root element", () => {
      const slice = createBlogHeroSlice();
      const { container } = render(
        <BlogHero slice={slice} index={0} slices={[]} context={{}} />,
      );
      expect(container.querySelector("section")).toHaveAttribute(
        "data-slice-variation",
        "default",
      );
    });
  });
});
