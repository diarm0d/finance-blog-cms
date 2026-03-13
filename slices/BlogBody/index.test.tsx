import { render, screen } from "@testing-library/react";
import BlogBody from "./index";
import mock from "./mocks.json";

jest.mock("@prismicio/react", () => ({
  PrismicRichText: ({ field }: { field: any }) => (
    <div data-testid="rich-text">{JSON.stringify(field)}</div>
  ),
}));

describe("BlogBody Slice", () => {
  it("should render the content", () => {
    const slice = mock[0] as any;

    render(
      <BlogBody slice={slice} index={0} slices={[]} context={undefined} />,
    );

    // Access the text deep inside the mock structure
    const expectedText = slice.primary.content.value[0].content.text;

    // Check if that text exists in the rendered output
    expect(screen.getByText(new RegExp(expectedText))).toBeInTheDocument();
  });
});
