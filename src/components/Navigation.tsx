import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import styles from "./Navigation.module.scss";

const Item: FunctionComponent<{ href: string }> = ({ href, children }) => {
  const router = useRouter();

  return (
    <li className={styles.item}>
      <Link href={href}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className={router.asPath === href ? styles.active : undefined}>
          {children}
        </a>
      </Link>
    </li>
  );
};

const Navigation: FunctionComponent = () => (
  <header>
    <nav>
      <ul>
        <Item href="/">Home</Item>
        <Item href="/status">Status</Item>
      </ul>
    </nav>
    <style jsx>{`
      nav {
        margin: 32px 0;
      }

      ul {
        --item-pad-x: 12px;

        margin: 0 calc(-1 * var(--item-pad-x));
        padding: 0;
        display: flex;
        overflow: hidden;
      }
    `}</style>
  </header>
);

export default Navigation;
