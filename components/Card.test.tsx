import { render, screen } from "@testing-library/react";
import Card, { CardProps } from "./Card";

jest.mock("@prismicio/next");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

const baseProps: CardProps = {
  title: "Test Article",
  description: "Test description text.",
  category: "Finance",
  date: "March 14, 2024",
  href: "/blog/test-article",
  image: {
    url: "https://example.com/image.jpg",
    alt: "Test image",
    dimensions: { width: 1200, height: 630 },
    copyright: null,
  },
};

describe("Card component", () => {
  it("renders the title", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("Test description text.")).toBeInTheDocument();
  });

  it("renders the category", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("Finance")).toBeInTheDocument();
  });

  it("renders the date", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("March 14, 2024")).toBeInTheDocument();
  });

  it("renders the card as a link with the correct href", () => {
    const { container } = render(<Card {...baseProps} />);
    expect(container.firstChild).toHaveAttribute("href", "/blog/test-article");
  });

  it("renders the default CTA button text", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("Read Story")).toBeInTheDocument();
  });

  it("renders a custom buttonCta", () => {
    render(<Card {...baseProps} buttonCta="Read More" />);
    expect(screen.getByText("Read More")).toBeInTheDocument();
  });

  it("renders the header image", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByTestId("prismic-next-image")).toHaveAttribute(
      "alt",
      "Test image",
    );
  });

  describe("primary variant (default)", () => {
    it("renders category and date together", () => {
      render(<Card {...baseProps} />);
      expect(screen.getByText("Finance")).toBeInTheDocument();
      expect(screen.getByText("March 14, 2024")).toBeInTheDocument();
    });

    it("does not render 'Featured' text by default", () => {
      render(<Card {...baseProps} />);
      expect(screen.queryByText("Featured")).not.toBeInTheDocument();
    });
  });

  describe("featured variant", () => {
    it("renders the default featuredText", () => {
      render(<Card {...baseProps} variant="featured" />);
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });

    it("renders a custom featuredText", () => {
      render(<Card {...baseProps} variant="featured" featuredText="Top Pick" />);
      expect(screen.getByText("Top Pick")).toBeInTheDocument();
    });

    it("renders the category alongside featuredText", () => {
      render(<Card {...baseProps} variant="featured" />);
      expect(screen.getByText("Finance")).toBeInTheDocument();
    });

    it("does not render date in the featured header row", () => {
      render(<Card {...baseProps} variant="featured" />);
      expect(screen.queryByText("March 14, 2024")).not.toBeInTheDocument();
    });
  });
});
