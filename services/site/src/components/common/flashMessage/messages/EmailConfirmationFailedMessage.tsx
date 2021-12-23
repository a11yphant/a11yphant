import clsx from "clsx";
import React from "react";

export const EmailConfirmationFailedMessage = (): React.ReactElement => {
  return (
    <>
      <span className={clsx("mr-3")} aria-hidden={true}>
        ❌
      </span>
      Your email could not be confirmed.
      {/*TODO: Resend button*/}
    </>
  );
};
