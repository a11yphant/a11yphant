import clsx from "clsx";
import React from "react";

export const HintReminderMessage = (): React.ReactElement => {
  return (
    <>
      <span className={clsx("mr-3")} aria-hidden={true}>
        🚀
      </span>
      <p className="m-0">Reminder: You can use hints if you are stuck</p>
    </>
  );
};
