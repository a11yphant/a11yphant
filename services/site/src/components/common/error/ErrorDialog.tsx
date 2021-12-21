import Button from "app/components/buttons/Button";
import { ApolloErrorResponse } from "app/components/common/error/useErrorDialog";
import Exclamation from "app/components/icons/Exclamation";
import { Modal } from "app/components/modal/Modal";
import { ModalActions } from "app/components/modal/ModalActions";
import { ModalContent } from "app/components/modal/ModalContent";
import { ModalTitle } from "app/components/modal/ModalTitle";
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
        "p-8 min-w-max max-w-xl",
        "flex flex-col",
        "bg-background-light",
        "border border-4 border-error-dark",
        "md:px-12 md:py-10 md:min-w-[32rem] md:mx-auto",
        "lg:px-16 lg:py-14",
        "xl:px-20 xl:py-16",
      )}
    >
      <ModalTitle as="div" className={clsx("flex")}>
        <Exclamation className={clsx("w-8 h-8 mr-2", "text-error-dark")} />
        <h2 className={clsx("mb-8", "h4")}>{title}</h2>
      </ModalTitle>

      <ModalContent>
        <div className={clsx("p-4")}>
          <ul>
            {messages.map((message, idx) => (
              <li key={idx}>{message}</li>
            ))}
          </ul>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className={clsx("p-8 border border-error")}>
            <strong className={clsx("text-error")}>Original Error was logged to console (only in development mode) </strong>
          </div>
        )}
      </ModalContent>

      <ModalActions>
        <Button
          onClick={onClose}
          overrideClassName
          className={clsx(
            "px-6 py-2.5 inline-flex items-center rounded tracking-wider bg-error-dark",
            "transition duration-300",
            "hover:text-light hover:bg-error hover:border-error",
          )}
        >
          Okay
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default ErrorDialog;
