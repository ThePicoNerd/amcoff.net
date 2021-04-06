import React from "react";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { getPosts, getPostSlugs, PostData } from "../lib/posts";
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
  <Base>
    <header>
      <h1>blog</h1>
    </header>
    <section>
      <PostList posts={posts} />
    </section>
  </Base>
);

export default Home;
