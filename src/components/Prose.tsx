import hydrate from "next-mdx-remote/hydrate";
import { MdxRemote } from "next-mdx-remote/types";
import React, { FunctionComponent } from "react";
import styles from "./Prose.module.scss";

export interface Props {
  source: MdxRemote.Source;
}

const Prose: FunctionComponent<Props> = ({ source }) => {
  const content = hydrate(source);

  return <div className={styles.container}>{content}</div>;
};

export default Prose;
