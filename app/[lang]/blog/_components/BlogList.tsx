import Card from "@/components/Card";
import Grid from "@/components/Grid";
import { isFilled } from "@prismicio/client";
import * as prismic from "@prismicio/client";
import { getTranslations } from "@/lib/i18n";

type Props = {
  blogPosts: prismic.Query<prismic.Content.BlogPageDocument>;
  lang: string;
};

const BlogList = ({ blogPosts, lang }: Props) => {
  const t = getTranslations(lang);
  const buttonCta = t.blog.cta;

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
              lang,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
            image={post.data.meta_image}
            href={post.url ?? `/blog/${post.uid}`}
            buttonCta={buttonCta}
          />
        );
      })}
    </Grid>
  );
};

export default BlogList;
