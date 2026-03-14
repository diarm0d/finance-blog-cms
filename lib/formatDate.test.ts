import { formatBlogDate } from "./formatDate";

describe("formatBlogDate", () => {
  it("formats a date string to uppercase locale date", () => {
    expect(formatBlogDate("2024-03-14")).toBe("MARCH 14, 2024");
  });

  it("formats January correctly", () => {
    expect(formatBlogDate("2024-01-01")).toBe("JANUARY 1, 2024");
  });

  it("formats December correctly", () => {
    expect(formatBlogDate("2024-12-31")).toBe("DECEMBER 31, 2024");
  });

  it("output is entirely uppercase", () => {
    const result = formatBlogDate("2024-06-15");
    expect(result).toBe(result.toUpperCase());
  });

  it("falls back gracefully when value is null", () => {
    const result = formatBlogDate(null);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("falls back gracefully when value is undefined", () => {
    const result = formatBlogDate(undefined);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
