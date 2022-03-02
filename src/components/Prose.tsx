import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React, { FunctionComponent, ReactNode } from "react";
import Image from "next/image";
import SyntaxHighlighter from "react-syntax-highlighter";
import Warning from "./Warning";
import styles from "./Prose.module.scss";

export interface Props {
  source: MDXRemoteSerializeResult;
}

const Code: FunctionComponent<{ className: string }> = ({
  className,
  ...props
}) => {
  const language = /language-(\w+)/.exec(className ?? "")?.[1];

  return language ? (
    <SyntaxHighlighter
      language={language}
      showLineNumbers
      wrapLongLines
      useInlineStyles={false}
      {...props}
    />
  ) : (
    <code className={className} {...props} />
  );
};

const components: Record<string, ReactNode> = {
  Warning,
  Image,
  code: Code,
};

const Prose: FunctionComponent<Props> = ({ source }) => (
  <div className={styles.container}>
    <MDXRemote {...source} components={components} />
  </div>
);

export default Prose;
