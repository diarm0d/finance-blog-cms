import type { ReactNode } from "react";
import { render, screen, act } from "@testing-library/react";
import { CategorySelectClient } from "./CategorySelectClient";
import { useRouter, useSearchParams } from "next/navigation";
import { createCategoryDocument } from "@/tests/helpers/fixtures";

type MockSelectProps = {
  onValueChange?: (details: { value: string[] }) => void;
  children?: ReactNode;
  placeholder?: string;
  collection?: unknown;
};

type WithChildren = { children?: ReactNode };

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

let capturedOnValueChange: ((details: { value: string[] }) => void) | undefined;

jest.mock("@/components/Select", () => ({
  Select: jest.fn((props: MockSelectProps) => {
    capturedOnValueChange = props.onValueChange;
    return <div data-testid="select">{props.children}</div>;
  }),
}));

jest.mock("@ark-ui/react/select", () => ({
  Select: {
    ItemGroup: (props: WithChildren) => <div>{props.children}</div>,
    Item: (props: WithChildren) => <div data-testid="select-item">{props.children}</div>,
    ItemText: (props: WithChildren) => <span>{props.children}</span>,
    ItemIndicator: (props: WithChildren) => <span>{props.children}</span>,
  },
  createListCollection: ({ items }: { items: unknown[] }) => ({ items }),
}));

const mockPush = jest.fn();

const categories = [
  createCategoryDocument("Banking & Finance", "banking-finance"),
  createCategoryDocument("Technology", "technology"),
];

describe("CategorySelectClient", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
    capturedOnValueChange = undefined;
  });

  it("renders the Select component", () => {
    render(<CategorySelectClient categories={categories} />);
    expect(screen.getByTestId("select")).toBeInTheDocument();
  });

  it("renders an 'All' option", () => {
    render(<CategorySelectClient categories={categories} />);
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("renders an option for each category", () => {
    render(<CategorySelectClient categories={categories} />);
    expect(screen.getByText("Banking & Finance")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
  });

  it("renders the placeholder when provided", () => {
    render(<CategorySelectClient categories={[]} placeholder="Filter by category" />);
    // Placeholder is passed as prop — verify Select receives it
    const { Select } = jest.requireMock("@/components/Select");
    expect((Select as jest.Mock).mock.calls[0][0].placeholder).toBe("Filter by category");
  });

  describe("handleCategoryChange", () => {
    it("pushes to /blog with the selected category and resets page to 1", () => {
      render(<CategorySelectClient categories={categories} />);
      act(() => { capturedOnValueChange?.({ value: ["technology"] }); });
      expect(mockPush).toHaveBeenCalledWith("/blog?category=technology&page=1");
    });

    it("resets page to 1 regardless of the current page", () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("page=5"));
      render(<CategorySelectClient categories={categories} />);
      act(() => { capturedOnValueChange?.({ value: ["banking-finance"] }); });
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("page=1"),
      );
    });

    it("preserves other existing search params", () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams("sort=asc"),
      );
      render(<CategorySelectClient categories={categories} />);
      act(() => { capturedOnValueChange?.({ value: ["technology"] }); });
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("sort=asc"),
      );
    });

    it("works with the 'all' value", () => {
      render(<CategorySelectClient categories={categories} />);
      act(() => { capturedOnValueChange?.({ value: ["all"] }); });
      expect(mockPush).toHaveBeenCalledWith("/blog?category=all&page=1");
    });
  });
});
