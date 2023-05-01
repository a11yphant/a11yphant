import { RestylableProps } from "app/components/modal/Modal";
import clsx from "clsx";
import React from "react";

export const ModalActions: React.FunctionComponent<React.PropsWithChildren<RestylableProps>> = ({
  children,
  className,
  overrideClassName = false,
}) => {
  return <div className={clsx(!overrideClassName && "absolute bottom-7 right-7", className)}>{children}</div>;
};
