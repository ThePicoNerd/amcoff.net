import React, { FunctionComponent } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import { PostData } from "../lib/posts";
import styles from "./PostList.module.scss";

export interface PostListProps {
  posts: PostData[];
}

const PostList: FunctionComponent<PostListProps> = ({
  posts,
}) => (
  <ul className={styles.list}>
    {posts.map((post) => (
      <li key={post.slug}>
        <time>{DateTime.fromISO(post.publishedAt).toLocaleString(DateTime.DATE_SHORT)}</time>
        <Link href={`/${post.slug}`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            {post.title}
          </a>
        </Link>
      </li>
    ))}
  </ul>
);

export default PostList;
