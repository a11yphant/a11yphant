import { RestylableProps } from "app/components/modal/Modal";
import clsx from "clsx";
import React from "react";

export const ModalContent: React.FunctionComponent<RestylableProps> = ({ children, className, overrideClassName = false }) => {
  return <div className={clsx(className)}>{children}</div>;
};
