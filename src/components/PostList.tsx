import React, { FunctionComponent } from "react";
import Link from "next/link";
import { PostMeta } from "../lib/posts";
import styles from "./PostList.module.scss";

export interface PostListProps {
  posts: PostMeta[];
}

const PostList: FunctionComponent<PostListProps> = ({ posts }) => (
  <section className={styles.list}>
    {posts.map((post) => (
      <Link href={`/${post.slug}`} key={post.slug}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>
          <article>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </article>
        </a>
      </Link>
    ))}
  </section>
);

export default PostList;
