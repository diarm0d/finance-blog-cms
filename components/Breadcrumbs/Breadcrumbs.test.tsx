import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

jest.mock("./useBreadcrumbs");

import { useBreadcrumbs } from "./useBreadcrumbs";

const mockUseBreadcrumbs = useBreadcrumbs as jest.Mock;

const twoCrumbs = [
  { label: "Blog", href: "/blog", isLast: false },
  { label: "My Article", href: "/blog/my-article", isLast: true },
];

describe("Breadcrumbs component", () => {
  beforeEach(() => {
    mockUseBreadcrumbs.mockReturnValue(twoCrumbs);
  });

  it("renders a nav element with aria-label='Breadcrumb'", () => {
    render(<Breadcrumbs />);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });

  it("renders all crumb labels", () => {
    render(<Breadcrumbs />);
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("My Article")).toBeInTheDocument();
  });

  it("renders non-last crumbs as links with correct href", () => {
    render(<Breadcrumbs />);
    const link = screen.getByRole("link", { name: "Blog" });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it("renders last crumb as a span with aria-current='page'", () => {
    render(<Breadcrumbs />);
    const current = screen.getByText("My Article");
    expect(current.tagName).toBe("SPAN");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("last crumb is not a link", () => {
    render(<Breadcrumbs />);
    expect(screen.queryByRole("link", { name: "My Article" })).not.toBeInTheDocument();
  });

  it("renders an empty list when there are no crumbs", () => {
    mockUseBreadcrumbs.mockReturnValue([]);
    render(<Breadcrumbs />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  describe("with category", () => {
    it("renders the category as a link", () => {
      render(<Breadcrumbs category="Technology" categoryParamName="category" />);
      expect(
        screen.getByRole("link", { name: "Technology" }),
      ).toBeInTheDocument();
    });

    it("builds the category href using the previous crumb as base", () => {
      render(<Breadcrumbs category="Technology" categoryParamName="category" />);
      const link = screen.getByRole("link", { name: "Technology" });
      expect(link).toHaveAttribute("href", "/blog?category=Technology");
    });

    it("applies a custom categoryParamName in the query string", () => {
      render(<Breadcrumbs category="Finance" categoryParamName="tag" />);
      const link = screen.getByRole("link", { name: "Finance" });
      expect(link).toHaveAttribute("href", expect.stringContaining("tag=Finance"));
    });
  });
});
