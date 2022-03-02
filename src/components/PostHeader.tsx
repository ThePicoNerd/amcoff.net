import React, { FunctionComponent } from "react";
import { DateTime } from "luxon";
import { PostMeta } from "../lib/posts";
import styles from "./PostHeader.module.scss";

export interface PostHeaderProps {
  meta: PostMeta;
}

const PostHeader: FunctionComponent<PostHeaderProps> = ({ meta }) => (
  <header className={styles.header}>
    <h1>{meta.title}</h1>
    <p className={styles.excerpt}>{meta.excerpt}</p>
    <time dateTime={meta.publishedAt}>
      {DateTime.fromISO(meta.publishedAt).toISODate()}
    </time>
  </header>
);

export default PostHeader;
