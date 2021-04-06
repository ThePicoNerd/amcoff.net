import React, { FunctionComponent } from "react";
import styles from "./Base.module.scss";

const Base: FunctionComponent = ({
  children,
}) => (
  <div className={styles.base}>
    {children}
    <footer>
      Copyright © 2021 ThePicoNerd
    </footer>
  </div>
);

export default Base;
