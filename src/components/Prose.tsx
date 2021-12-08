import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React, { FunctionComponent } from "react";
import styles from "./Prose.module.scss";

export interface Props {
  source: MDXRemoteSerializeResult;
}

const Prose: FunctionComponent<Props> = ({ source }) => (
  <div className={styles.container}>
    <MDXRemote {...source} />
  </div>
);

export default Prose;
