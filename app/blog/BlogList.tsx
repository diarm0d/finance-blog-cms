import Card from "@/components/Card";
import Grid from "@/components/Grid";
import { isFilled } from "@prismicio/client";
import * as prismic from "@prismicio/client";

type Props = {
  blogPosts: prismic.Query<prismic.Content.BlogPageDocument>;
};

const BlogList = ({blogPosts}: Props) => {
  return (
    <Grid className="min-h-96">
      {blogPosts.results.map((post) => {
        const category =
          (isFilled.contentRelationship(post.data.category) &&
            post.data.category.data?.name) ||
          "Uncategorized";
        return (
          <Card
            key={post.id}
            title={post.data.title ?? ""}
            description={post.data.snippet ?? ""}
            category={category}
            date={new Date(post.first_publication_date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
            image={post.data.meta_image}
            href={`/blog/${post.uid}`}
          />
        );
      })}
    </Grid>
  );
};

export default BlogList;
