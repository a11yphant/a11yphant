import clsx from "clsx";
import React from "react";

export const HintReminderMessage = (): React.ReactElement => {
  return (
    <>
      <span className={clsx("mr-3")} aria-hidden={true}>
        🚀
      </span>
      Reminder: You can use hints if you are stuck
    </>
  );
};
