import { Dialog, Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import clsx from "clsx";
import React from "react";

export interface ConfirmationModalProps {
  open?: boolean;
  title: string;
  cancelButtonLabel?: string;
  onCancel: () => void;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
}

const ConfirmationModal: React.FunctionComponent<ConfirmationModalProps> = ({
  open = false,
  title,
  cancelButtonLabel,
  onCancel,
  confirmButtonLabel,
  onConfirm,
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
      <Dialog open={open} onClose={onCancel} className={clsx("fixed z-10 inset-0 overflow-y-auto h-screen flex items-center justify-center")}>
        <div className={clsx("w-1/2 h-64 px-12 py-14 relative bg-background-light rounded-lg max-w-2xl", " shadow-modal")}>
          <Dialog.Overlay className="fixed inset-0 bg-background opacity-25 z-[-1]" />

          <Button
            onClick={onCancel}
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

          <Dialog.Title className={clsx("text-2xl")}>{title}</Dialog.Title>

          <div className="absolute bottom-7 right-7">
            <Button
              onClick={onCancel}
              overrideClassName
              className={clsx(
                "mr-16 border-b-2 border-transparent",
                "transition-colors duration-300",
                "hover:text-primary-light hover:border-primary-light",
                "focus:text-primary-light focus:border-primary-light",
              )}
            >
              {cancelButtonLabel ?? "Cancel"}
            </Button>
            <Button onClick={onConfirm} primary className="px-6 py-4 leading-4">
              {confirmButtonLabel ?? "Confirm"}
            </Button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
