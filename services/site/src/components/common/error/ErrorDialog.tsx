import { Dialog } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import { ApolloErrorResponse } from "app/components/common/error/useErrorDialog";
import Exclamation from "app/components/icons/Exclamation";
import { Modal, ModalActions, ModalContent, ModalTitle } from "app/components/modal/Modal";
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
  React.useEffect(() => {
    if (errorResponse && process.env.NODE_ENV === "development") {
      console.error(errorResponse);
    }
  }, [errorResponse]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={clsx(
        "bg-background-light",
        "p-8 min-w-max max-w-xl",
        "flex flex-col",
        "md:px-12 md:py-10 md:min-w-[32rem] md:mx-auto",
        "lg:px-16 lg:py-14",
        "xl:px-20 xl:py-16",
        "border border-4 border-error-dark",
      )}
    >
      <ModalTitle className="flex">
        <Exclamation className={clsx("w-8 h-8 mr-2", "text-error-dark")} />
        <Dialog.Title className={clsx("mb-8", "h4")}>{title}</Dialog.Title>
      </ModalTitle>

      <ModalContent>
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
      </ModalContent>

      <ModalActions>
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
      </ModalActions>
    </Modal>
  );
};

export default ErrorDialog;
