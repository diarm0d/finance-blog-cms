import { renderHook } from "@testing-library/react";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.Mock;

describe("useBreadcrumbs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an empty array when pathname is null", () => {
    mockUsePathname.mockReturnValue(null);
    const { result } = renderHook(() => useBreadcrumbs());
    expect(result.current).toEqual([]);
  });

  it("returns a single crumb for a single-segment path", () => {
    mockUsePathname.mockReturnValue("/blog");
    const { result } = renderHook(() => useBreadcrumbs());
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toMatchObject({
      label: "Blog",
      href: "/blog",
      isLast: true,
    });
  });

  it("returns multiple crumbs for a multi-segment path", () => {
    mockUsePathname.mockReturnValue("/blog/my-article");
    const { result } = renderHook(() => useBreadcrumbs());
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toMatchObject({
      label: "Blog",
      href: "/blog",
      isLast: false,
    });
    expect(result.current[1]).toMatchObject({
      label: "My article",
      href: "/blog/my-article",
      isLast: true,
    });
  });

  it("marks only the last segment as isLast", () => {
    mockUsePathname.mockReturnValue("/a/b/c");
    const { result } = renderHook(() => useBreadcrumbs());
    const lastFlags = result.current.map((c) => c.isLast);
    expect(lastFlags).toEqual([false, false, true]);
  });

  it("uses a custom label when provided", () => {
    mockUsePathname.mockReturnValue("/blog");
    const { result } = renderHook(() =>
      useBreadcrumbs({ labels: { blog: "Overview" } }),
    );
    expect(result.current[0].label).toBe("Overview");
  });

  it("replaces hyphens with spaces in the segment label", () => {
    mockUsePathname.mockReturnValue("/blog/my-long-article");
    const { result } = renderHook(() => useBreadcrumbs());
    expect(result.current[1].label).toBe("My long article");
  });

  it("capitalizes the first letter of the segment label", () => {
    mockUsePathname.mockReturnValue("/finance");
    const { result } = renderHook(() => useBreadcrumbs());
    expect(result.current[0].label).toBe("Finance");
  });

  it("builds correct hrefs for each crumb", () => {
    mockUsePathname.mockReturnValue("/blog/my-article");
    const { result } = renderHook(() => useBreadcrumbs());
    expect(result.current[0].href).toBe("/blog");
    expect(result.current[1].href).toBe("/blog/my-article");
  });

  describe("with category", () => {
    it("uses the category as the last crumb label", () => {
      mockUsePathname.mockReturnValue("/blog/my-article");
      const { result } = renderHook(() =>
        useBreadcrumbs({ category: "Technology" }),
      );
      expect(result.current[1].label).toBe("Technology");
    });

    it("includes the category query param in the last crumb href", () => {
      mockUsePathname.mockReturnValue("/blog/my-article");
      const { result } = renderHook(() =>
        useBreadcrumbs({ category: "Technology", categoryParamName: "category" }),
      );
      expect(result.current[1].href).toContain("category=Technology");
    });

    it("does not include the query param in non-last crumb hrefs", () => {
      mockUsePathname.mockReturnValue("/blog/my-article");
      const { result } = renderHook(() =>
        useBreadcrumbs({ category: "Technology" }),
      );
      expect(result.current[0].href).not.toContain("category");
    });

    it("does not override non-last crumb labels with category", () => {
      mockUsePathname.mockReturnValue("/blog/my-article");
      const { result } = renderHook(() =>
        useBreadcrumbs({ category: "Technology" }),
      );
      expect(result.current[0].label).toBe("Blog");
    });
  });
});
