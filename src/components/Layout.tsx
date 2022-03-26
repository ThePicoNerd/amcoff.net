import Head from "next/head";
import React, { FunctionComponent } from "react";
import styles from "./Layout.module.scss";

export interface Props {
  title: string;
  description: string;
  type?: string;
  images?: string[];
}

const Layout: FunctionComponent<Props> = ({
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
      <meta property="og:site_name" content="amcoff.net" />
      <meta property="og:description" content={description} />

      {images.map((image) => (
        <meta key={image} property="og:image" content={image} />
      ))}
    </Head>
    <div className={styles.base}>
      {children}
      <footer>Åke Amcoff</footer>
    </div>
  </>
);

export default Layout;
