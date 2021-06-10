import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import React, { FunctionComponent } from "react";
import styles from "./PostContent.module.scss";

export interface PostContentProps {
  source: MdxRemote.Source;
}

const PostContent: FunctionComponent<PostContentProps> = ({ source }) => {
  const content = hydrate(source);

  return <div className={styles.content}>{content}</div>;
};

export default PostContent;
