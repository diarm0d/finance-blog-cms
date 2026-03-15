import { render, screen } from "@testing-library/react";
import BlogList from "./BlogList";
import Card from "@/components/Card";
import {
  createBlogPost,
  createBlogQuery,
  unfilledRelationship,
} from "@/tests/helpers/fixtures";

jest.mock("@/components/Card", () => ({
  __esModule: true,
  default: jest.fn(({ title, description, category, date, href }) => (
    <div
      data-testid="card"
      data-title={title}
      data-description={description}
      data-category={category}
      data-date={date}
      data-href={href}
    />
  )),
}));

const MockedCard = Card as jest.Mock;

describe("BlogList", () => {
  it("renders one Card per post", () => {
    const query = createBlogQuery([
      createBlogPost(),
      createBlogPost({ id: "post-2", uid: "test-post-2" }),
    ]);
    render(<BlogList blogPosts={query} lang="en-us" />);
    expect(screen.getAllByTestId("card")).toHaveLength(2);
  });

  it("renders nothing when there are no posts", () => {
    render(<BlogList blogPosts={createBlogQuery([])} lang="en-us" />);
    expect(screen.queryAllByTestId("card")).toHaveLength(0);
  });

  it("passes the post title to Card", () => {
    const query = createBlogQuery([createBlogPost({ title: "My Finance Guide" })]);
    render(<BlogList blogPosts={query} lang="en-us" />);
    expect(MockedCard.mock.calls[0][0].title).toBe("My Finance Guide");
  });

  it("passes the post snippet as description to Card", () => {
    const query = createBlogQuery([createBlogPost({ snippet: "A great read." })]);
    render(<BlogList blogPosts={query} lang="en-us" />);
    expect(MockedCard.mock.calls[0][0].description).toBe("A great read.");
  });

  it("passes the correct href to Card", () => {
    const query = createBlogQuery([createBlogPost({ uid: "my-article" })]);
    render(<BlogList blogPosts={query} lang="en-us" />);
    expect(MockedCard.mock.calls[0][0].href).toBe("/blog/my-article");
  });

  it("passes the meta_image to Card", () => {
    render(<BlogList blogPosts={createBlogQuery([createBlogPost()])} lang="en-us" />);
    expect(MockedCard.mock.calls[0][0].image.url).toBe("https://example.com/meta.jpg");
    expect(MockedCard.mock.calls[0][0].image.alt).toBe("Test meta image");
  });

  it("passes the category name when the relationship is filled", () => {
    render(<BlogList blogPosts={createBlogQuery([createBlogPost()])} lang="en-us" />);
    expect(MockedCard.mock.calls[0][0].category).toBe("Banking & Finance");
  });

  it("falls back to 'Uncategorized' when the category relationship is unfilled", () => {
    const post = createBlogPost({ category: unfilledRelationship });
    render(<BlogList blogPosts={createBlogQuery([post])} lang="en-us" />);
    expect(MockedCard.mock.calls[0][0].category).toBe("Uncategorized");
  });

  it("passes a formatted date string to Card", () => {
    const query = createBlogQuery([
      createBlogPost({ firstPublicationDate: "2024-03-14T12:00:00+0000" }),
    ]);
    render(<BlogList blogPosts={query} lang="en-us" />);
    expect(MockedCard.mock.calls[0][0].date).toContain("2024");
    expect(MockedCard.mock.calls[0][0].date).toBeTruthy();
  });
});
