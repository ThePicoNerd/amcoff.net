import React, { FunctionComponent } from "react";
import Link from "next/link";
import { PostMeta } from "../lib/posts";
import styles from "./PostList.module.scss";

export interface PostListProps {
  posts: PostMeta[];
}

const PostList: FunctionComponent<PostListProps> = ({ posts }) => (
  <ul className={styles.list}>
    {posts.map((post) => (
      <li key={post.slug}>
        <Link href={`/${post.slug}`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>{post.title}</a>
        </Link>
      </li>
    ))}
  </ul>
);

export default PostList;
