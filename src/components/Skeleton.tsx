import React, { FunctionComponent } from "react";

const Skeleton: FunctionComponent<{ width?: string | number }> = ({
  width = "100%",
}) => (
  <span>
    <style jsx>{`
      span {
        height: 1em;
        line-height: 1;
        display: inline-block;
        background-color: var(--skeleton);
        border-radius: 4px;
      }
    `}</style>
    <style jsx>{`
      span {
        width: ${width};
      }
    `}</style>
  </span>
);

export default Skeleton;
