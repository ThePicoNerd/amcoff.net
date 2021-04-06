import React from "react";
import { GetStaticProps, NextPage } from "next";
import { getPosts, PostData } from "../lib/posts";
import Base from "../components/Base";
import PostList from "../components/PostList";

export interface HomeProps {
  posts: PostData[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = getPosts();

  return {
    props: {
      posts,
    },
  };
};

const Home: NextPage<HomeProps> = ({
  posts,
}) => (
  <Base title="blog" description="a random blog about random things">
    <header>
      <h1>blog</h1>
    </header>
    <section>
      <PostList posts={posts} />
    </section>
  </Base>
);

export default Home;
