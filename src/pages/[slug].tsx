import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import Layout from "../components/Layout";
import Prose from "../components/Prose";
import PostHeader from "../components/PostHeader";
import { getPostBySlug, getPostSlugs, Post } from "../lib/posts";

export interface PostPageProps {
  post: Post;
}

export interface PostPageParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<PostPageParams> = async () => {
  const slugs = getPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps, PostPageParams> =
  async ({ params }) => {
    const slug = params.slug?.toString();
    const post = await getPostBySlug(slug);

    return {
      props: {
        post,
      },
    };
  };

const PostPage: NextPage<PostPageProps> = ({ post }) => (
  <Layout
    title={post.meta.title}
    description={post.meta.excerpt}
    images={post.meta.images}
    type="article"
  >
    <article>
      <PostHeader meta={post.meta} />
      <Prose source={post.mdxSource} />
    </article>
  </Layout>
);

export default PostPage;
