import Head from "next/head";
import React, { FunctionComponent } from "react";
import styles from "./Base.module.scss";

export interface BaseProps {
  title: string;
  description: string;
  type?: string;
  images?: string[];
}

const Base: FunctionComponent<BaseProps> = ({
  children,
  title,
  description,
  type = "website",
  images = [],
}) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content="blog" />
      <meta property="og:description" content={description} />

      {images.map((image) => (
        <meta key={image} property="og:image" content={image} />
      ))}
    </Head>
    <div className={styles.base}>
      {children}
      <footer>
        Copyright © 2021 ThePicoNerd
      </footer>
    </div>
  </>
);

export default Base;
