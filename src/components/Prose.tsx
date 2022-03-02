import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React, { FunctionComponent, ReactNode } from "react";
import Image from "next/image";
import Warning from "./Warning";
import styles from "./Prose.module.scss";

export interface Props {
  source: MDXRemoteSerializeResult;
}

const components: Record<string, ReactNode> = {
  Warning,
  Image,
};

const Prose: FunctionComponent<Props> = ({ source }) => (
  <div className={styles.container}>
    <MDXRemote {...source} components={components} />
  </div>
);

export default Prose;
