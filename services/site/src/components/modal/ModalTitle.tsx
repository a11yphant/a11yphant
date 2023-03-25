import { Dialog } from "@headlessui/react";
import { RestylableProps } from "app/components/modal/Modal";
import clsx from "clsx";
import React from "react";

interface ModalTitleProps {
  as?: React.ElementType;
}

export const ModalTitle: React.FunctionComponent<ModalTitleProps & RestylableProps> = ({ children, className, as }) => {
  return (
    <Dialog.Title as={as} className={clsx(className)}>
      {children}
    </Dialog.Title>
  );
};
