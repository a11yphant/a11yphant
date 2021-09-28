import { Dialog, Transition } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import { ApolloErrorResponse } from "app/components/common/error/useErrorDialog";
import Exclamation from "app/components/icons/Exclamation";
import X from "app/components/icons/X";
import clsx from "clsx";
import React from "react";

export interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  messages: Array<React.ReactNode>;
  errorResponse?: ApolloErrorResponse;
}

const ErrorDialog: React.FunctionComponent<ErrorDialogProps> = ({ open, onClose, title, messages, errorResponse }) => {
  const handleEscapeClick = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleEscapeClick);

    return () => {
      document.removeEventListener("keydown", handleEscapeClick);
    };
  }, []);

  React.useEffect(() => {
    console.error(errorResponse);
  }, [errorResponse]);

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
        <div
          className={clsx(
            "p-8 bg-background-light rounded-lg min-w-max max-w-xl flex flex-col relative",
            "md:px-12 md:py-10 md:min-w-[32rem] md:mx-auto",
            "lg:px-16 lg:py-14",
            "xl:px-20 xl:py-16",
            "border border-4 border-error-dark",
          )}
        >
          <Dialog.Overlay className="fixed inset-0 bg-background opacity-25 z-[-1]" />
          <Button
            onClick={onClose}
            overrideClassName
            className={clsx("w-11 h-11 p-3.5 absolute top-4 right-4", "transition-colors duration-300", "hover:text-error", "focus:text-error")}
          >
            <span className="sr-only">Close</span>
            <X />
          </Button>

          <div className="flex">
            <Exclamation className={clsx("w-8 h-8 mr-2", "text-error-dark")} />
            <Dialog.Title className={clsx("mb-8", "h4")}>{title}</Dialog.Title>
          </div>

          <div className="p-4">
            <ul>
              {messages.map((message, idx) => (
                <li key={idx}>{message}</li>
              ))}
            </ul>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="p-8 border border-error">
              <strong className="text-error">Original Error was logged to console (only in development mode) </strong>
            </div>
          )}

          <div className="absolute bottom-7 right-7">
            <Button
              onClick={onClose}
              overrideClassName
              className={clsx(
                "px-6 py-4 leading-4 inline-flex items-center rounded tracking-wider transition duration-300",
                "hover:text-white hover:bg-error hover:border-error",
                "focus:text-white focus:bg-error focus:border-error",
                "bg-error-dark",
              )}
            >
              Okay
            </Button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ErrorDialog;
