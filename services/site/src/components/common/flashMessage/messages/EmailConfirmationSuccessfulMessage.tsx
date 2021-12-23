import clsx from "clsx";
import React from "react";

export const EmailConfirmationSuccessfulMessage = (): React.ReactElement => {
  return (
    <>
      <span className={clsx("mr-3")} aria-hidden={true}>
        ✅
      </span>
      Your email was confirmed successfully.
    </>
  );
};
