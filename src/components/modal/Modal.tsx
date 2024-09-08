import { Dialog, Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import ClosingX from "app/components/icons/ClosingX";
import clsx from "clsx";
import React, { useRef } from "react";

export interface RestylableProps {
  className?: string;
  overrideClassName?: boolean;
}

export interface ConfirmationModalProps {
  open?: boolean;
  onClose?: () => void;
}

export const Modal: React.FC<React.PropsWithChildren<ConfirmationModalProps & RestylableProps>> = ({
  open = false,
  onClose,
  children,
  className,
  overrideClassName = false,
}) => {
  // reference button for initial focus
  const closeButtonRef = useRef();

  return (
    <Transition
      show={open}
      enter="transition duration-100 ease-out"
      enterFrom="scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
    >
      <Dialog
        initialFocus={closeButtonRef}
        open={open}
        onClose={onClose}
        className={clsx("fixed z-30 inset-0 overflow-y-auto h-screen h-[100dvh]  flex items-center justify-center")}
      >
        <div className={clsx("fixed inset-0 bg-background opacity-70 z-[-1] cursor-pointer")} />
        <Dialog.Panel className={clsx("relative", !overrideClassName && "rounded-lg", className)}>
          <Button
            innerRef={closeButtonRef}
            onClick={onClose}
            overrideClassName
            className={clsx(
              "w-11 h-11 p-3.5 absolute top-4 right-4 rounded",
              "z-10",
              "transition ease-in-out duration-300",
              "hover:text-light",
              "motion-safe:hover:scale-125 motion-reduce:hover:outline-light motion-reduce:hover:outline-2 motion-reduce:hover:outline",
              "focus:text-light",
            )}
          >
            <span className={clsx("sr-only")}>Close</span>
            <ClosingX />
          </Button>

          {children}
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};
