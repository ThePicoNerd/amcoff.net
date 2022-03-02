import React, { FunctionComponent } from "react";
import { AlertTriangle } from "react-feather";
import styles from "./Warning.module.scss";

const Warning: FunctionComponent = ({ children }) => (
  <div className={styles.root}>
    <AlertTriangle className={styles.icon} />
    <div>{children}</div>
  </div>
);

export default Warning;
