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
      onClose?.();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleEscapeClick);

    return () => {
      document.removeEventListener("keydown", handleEscapeClick);
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className={clsx("z-10 inset-0 overflow-y-auto bg-grey-dark bg-opacity-50 flex justify-center items-center", open ? "fixed" : "hidden")}
      aria-hidden
    >
      <div
        className={clsx(
          "min-w-[25%] max-w-[50%] min-h-[16rem] max-h-screen overflow-auto px-12 py-14 relative bg-background-light rounded-lg",
          "shadow-modal",
          "border border-4 border-error-dark",
        )}
      >
        <Button
          onClick={onClose}
          overrideClassName
          className={clsx("absolute top-6 right-6", "transition-colors duration-300", "hover:text-error", "focus:text-error")}
        >
          <span className="sr-only">Close</span>
          <X className="w-3.5 h-3.5" />
        </Button>

        <div className="flex">
          <Exclamation className={clsx("w-8 h-8 mr-2", "text-error-dark")} />
          <h2 className={clsx("text-2xl")}>{title}</h2>
        </div>

        <div className="p-4">
          <ul>
            {messages.map((message, idx) => (
              <li key={idx}>{message}</li>
            ))}
          </ul>
        </div>

        {/*{process.env.NODE_ENV === "development" && (*/}
        {/*  <div className="p-8 border border-error">*/}
        {/*    <strong className="text-error">Original Error (Only shown in Development Mode): </strong>*/}
        {/*    <p>{error}</p>*/}
        {/*  </div>*/}
        {/*)}*/}

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
    </div>
  );
};

export default ErrorDialog;
