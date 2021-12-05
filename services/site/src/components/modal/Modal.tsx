import { Dialog, Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import clsx from "clsx";
import React from "react";

export interface RestylableProps {
  className?: string;
  overrideClassName?: boolean;
}

export interface ConfirmationModalProps {
  open?: boolean;
  onClose?: () => void;
}

export const Modal: React.FunctionComponent<ConfirmationModalProps & RestylableProps> = ({
  open = false,
  onClose,
  children,
  className,
  overrideClassName = false,
}) => {
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
        <div className={clsx("relative", !overrideClassName && "rounded-lg", className)}>
          <Dialog.Overlay className="fixed inset-0 bg-background opacity-25 z-[-1] cursor-pointer" />

          <Button
            onClick={onClose}
            overrideClassName
            className={clsx(
              "w-11 h-11 p-3.5 absolute top-4 right-4",
              "z-10",
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
