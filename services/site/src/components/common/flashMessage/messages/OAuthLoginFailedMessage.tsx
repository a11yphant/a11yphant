import clsx from "clsx";
import React from "react";

export const OAuthLoginFailedMessage = (): React.ReactElement => {
  return (
    <>
      <span className={clsx("mr-3")} aria-hidden={true}>
        ❌
      </span>
      <p className="m-0">Login failed. Please try again.</p>
    </>
  );
};
