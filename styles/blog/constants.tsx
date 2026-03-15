import { RichTextComponents, PrismicLink } from "@prismicio/react";
import Heading from "@/components/Heading";

export const blogComponents: RichTextComponents = {
  heading1: ({ children }) => (
    <Heading as="h1" size="lg" className={`mb-4`}>
      {children}
    </Heading>
  ),
  heading2: ({ children }) => (
    <Heading as="h2" size="md" className={`mb-4`}>
      {children}
    </Heading>
  ),
  heading3: ({ children }) => (
    <Heading as="h3" size="sm" className={`mb-4`}>
      {children}
    </Heading>
  ),
  paragraph: ({ children }) => (
    <p className={`text-md font-normal text-gray-500 mb-4`}>{children}</p>
  ),
  hyperlink: ({ children, node }) => (
    <PrismicLink field={node.data} className={`text-blue-500 hover:underline`}>
      {children}
    </PrismicLink>
  ),
  list: ({ children }) => (
    <ul className={`list-disc ml-6 mb-4 space-y-2 text-gray-500`}>
      {children}
    </ul>
  ),
  listItem: ({ children }) => (
    <li className={`text-md font-normal leading-relaxed`}>{children}</li>
  ),
  oList: ({ children }) => (
    <ol className={`list-decimal ml-6 mb-4 space-y-2 text-gray-500`}>
      {children}
    </ol>
  ),
  oListItem: ({ children }) => (
    <li className={`text-md font-normal leading-relaxed`}>{children}</li>
  ),
};
