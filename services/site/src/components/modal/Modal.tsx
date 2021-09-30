import { Dialog, Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import clsx from "clsx";
import React from "react";

export interface ConfirmationModalProps {
  open?: boolean;
  onClose?: () => void;
}

export const Modal: React.FunctionComponent<ConfirmationModalProps> = ({ open = false, onClose, children }) => {
  return (
    <Transition
      show={open}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog open={open} onClose={onClose} className={clsx("fixed z-10 inset-0 overflow-y-auto h-screen flex items-center justify-center")}>
        <div className={clsx("w-1/2 h-64 px-12 py-14 relative bg-background-light rounded-lg max-w-2xl", " shadow-modal")}>
          <Dialog.Overlay className="fixed inset-0 bg-background opacity-25 z-[-1]" />

          <Button
            onClick={onClose}
            overrideClassName
            className={clsx(
              "w-11 h-11 p-3.5 absolute top-4 right-4",
              "transition-colors duration-300",
              "hover:text-primary-light",
              "focus-visible:text-primary-light",
            )}
          >
            <span className="sr-only">Close</span>
            <X />
          </Button>

          {children}
        </div>
      </Dialog>
    </Transition>
  );
};

interface RestylableProps {
  className?: string;
  overrideClassName?: boolean;
}

export const ModalTitle: React.FunctionComponent<RestylableProps> = ({ children, className, overrideClassName = false }) => {
  return <Dialog.Title className={clsx(!overrideClassName && "text-2xl", className)}>{children}</Dialog.Title>;
};

export const ModalContent: React.FunctionComponent<RestylableProps> = ({ children, className, overrideClassName = false }) => {
  return <div className={clsx(className)}>{children}</div>;
};

export const ModalActions: React.FunctionComponent<RestylableProps> = ({ children, className, overrideClassName = false }) => {
  return <div className={clsx(!overrideClassName && "absolute bottom-7 right-7", className)}>{children}</div>;
};
