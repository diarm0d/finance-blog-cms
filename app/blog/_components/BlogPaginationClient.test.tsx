import { render, screen, act } from "@testing-library/react";
import BlogPaginationClient from "./BlogPaginationClient";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

let capturedOnPageChange: ((details: { page: number; pageSize: number }) => void) | undefined;

jest.mock("@/components/Pagination", () => ({
  Pagination: jest.fn(({ onPageChange, page, count, pageSize }) => {
    capturedOnPageChange = onPageChange;
    return (
      <div
        data-testid="pagination"
        data-page={page}
        data-count={count}
        data-page-size={pageSize}
      />
    );
  }),
}));

const mockPush = jest.fn();

describe("BlogPaginationClient", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
    capturedOnPageChange = undefined;
  });

  it("renders the Pagination component", () => {
    render(<BlogPaginationClient count={50} pageSize={10} />);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("passes count to Pagination", () => {
    render(<BlogPaginationClient count={50} pageSize={10} />);
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-count", "50");
  });

  it("passes pageSize to Pagination", () => {
    render(<BlogPaginationClient count={50} pageSize={10} />);
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-page-size", "10");
  });

  it("defaults to page 1 when no page param is present", () => {
    render(<BlogPaginationClient count={50} pageSize={10} />);
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-page", "1");
  });

  it("reads the current page from searchParams", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("page=3"));
    render(<BlogPaginationClient count={50} pageSize={10} />);
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-page", "3");
  });

  describe("handlePageChange", () => {
    it("pushes to /blog with the new page number", () => {
      render(<BlogPaginationClient count={50} pageSize={10} />);
      act(() => { capturedOnPageChange?.({ page: 3, pageSize: 10 }); });
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("page=3"),
      );
    });

    it("preserves existing search params when changing page", () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams("category=technology"),
      );
      render(<BlogPaginationClient count={50} pageSize={10} />);
      act(() => { capturedOnPageChange?.({ page: 2, pageSize: 10 }); });
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("category=technology"),
      );
    });

    it("overwrites the existing page param", () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("page=1"));
      render(<BlogPaginationClient count={50} pageSize={10} />);
      act(() => { capturedOnPageChange?.({ page: 4, pageSize: 10 }); });
      const url = mockPush.mock.calls[0][0] as string;
      expect(url).toContain("page=4");
      expect(url).not.toContain("page=1");
    });
  });
});
