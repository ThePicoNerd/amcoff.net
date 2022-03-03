import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React, { FunctionComponent, ReactNode } from "react";
import Image from "next/image";
import SyntaxHighlighter from "react-syntax-highlighter";
import Warning from "./Warning";
import styles from "./Prose.module.scss";

export interface Props {
  source: MDXRemoteSerializeResult;
}

const Code: FunctionComponent<{
  className: string;
  filename?: string;
  url?: string;
}> = ({ className, children, filename, url, ...props }) => {
  const language = /language-(\w+)/.exec(className ?? "")?.[1];
  const code = children.toString().replace(/\n$/, "");

  return language ? (
    <SyntaxHighlighter
      language={language}
      useInlineStyles={false}
      className={styles.pre}
      {...props}
    >
      {code}
    </SyntaxHighlighter>
  ) : (
    <pre className={styles.pre}>
      <code className={className} {...props}>
        {children}
      </code>
    </pre>
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
