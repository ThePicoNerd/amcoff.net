import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import Base from "../components/Base";
import PostContent from "../components/PostContent";
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

export const getStaticProps: GetStaticProps<PostPageProps, PostPageParams> = async ({
  params,
}) => {
  const slug = params.slug?.toString();
  const post = await getPostBySlug(slug);

  return {
    props: {
      post,
    },
  };
};

const PostPage: NextPage<PostPageProps> = ({
  post,
}) => (
  <Base title={post.data.title} description={post.data.excerpt} images={post.data.images} type="article">
    <article>
      <PostHeader data={post.data} />
      <PostContent source={post.mdxSource} />
    </article>
  </Base>
);

export default PostPage;
