import React from "react";
import { GetStaticProps, NextPage } from "next";
import { getPosts, PostMeta } from "../lib/posts";
import Layout from "../components/Layout";
import PostList from "../components/PostList";

export interface HomeProps {
  posts: PostMeta[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = getPosts();

  return {
    props: {
      posts,
    },
  };
};

const Home: NextPage<HomeProps> = ({ posts }) => (
  <Layout title="Åke Amcoff" description="a random blog about random things">
    <header>
      <h1>Åke Amcoff</h1>
    </header>
    <section>
      <PostList posts={posts} />
    </section>
  </Layout>
);

export default Home;
