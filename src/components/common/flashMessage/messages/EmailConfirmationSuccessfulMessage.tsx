import clsx from "clsx";
import React from "react";

export const EmailConfirmationSuccessfulMessage = (): React.ReactElement => {
  return (
    <div className={clsx("flex justify-center items-center")}>
      <span className={clsx("not-sr-only", "mr-3 text-2xl")} aria-hidden={true}>
        ✅
      </span>
      <p className="m-0">Your e-mail was confirmed successfully.</p>
    </div>
  );
};
