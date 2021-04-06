import React, { FunctionComponent } from "react";
import { DateTime } from "luxon";
import { PostData } from "../lib/posts";
import styles from "./PostHeader.module.scss";

export interface PostHeaderProps {
  data: PostData;
}

const PostHeader: FunctionComponent<PostHeaderProps> = ({
  data,
}) => (
  <header className={styles.header}>
    <h1>{data.title}</h1>
    <time>{DateTime.fromISO(data.publishedAt).toLocaleString(DateTime.DATE_SHORT)}</time>
  </header>
);

export default PostHeader;
