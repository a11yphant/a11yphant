import { ApolloError } from "@apollo/client";
import ErrorDialog, { ErrorDialogProps } from "app/components/common/error/ErrorDialog";
import { errorMessages } from "app/components/common/error/errorMessages";
import React from "react";

export type ApolloErrorResponse = Pick<ApolloError, "graphQLErrors" | "networkError">;

interface EditDialogErrorOptions {
  title?: string;
  defaultMessage?: React.ReactNode;
  specialMessages?: {
    [key: string]: React.ReactNode;
  };
}

export interface ErrorDialogApi {
  showApolloError: (error: ApolloErrorResponse, options?: EditDialogErrorOptions) => void;
}

const ErrorDialogContext = React.createContext<ErrorDialogApi>({
  showApolloError: () => {
    throw new Error("Error Dialog used outside ErrorDialogContext");
  },
});

const defaultTitle = "An error occurred :(";

export const useErrorDialog = (): { errorDialog: React.ReactElement<ErrorDialogProps>; errorDialogApi: ErrorDialogApi } => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(defaultTitle);
  const [messages, setMessages] = React.useState<Array<React.ReactNode>>([]);
  const [error, setError] = React.useState<ApolloErrorResponse>();

  const showApolloError = ({ graphQLErrors, networkError }: ApolloErrorResponse, options?: EditDialogErrorOptions): void => {
    setTitle(options?.title ?? defaultTitle);
    setError({ graphQLErrors, networkError });

    const messages = [];
    let unknownErrorExisting = false;

    if (networkError) {
      messages.push(errorMessages.networkError());
    } else if (graphQLErrors) {
      graphQLErrors.map((graphQLError) => {
        let errorMessage;
        if (options?.specialMessages?.[graphQLError.extensions.code]) {
          // Show error message for this error code if it has been defined
          errorMessage = options?.specialMessages?.[graphQLError.extensions.code];
        } else if (graphQLError.message.length > 0) {
          // Show error message from API if it exists
          errorMessage = graphQLError.message;
        } else if (options?.defaultMessage) {
          // Show default error message if it has been defined
          errorMessage = options?.defaultMessage;
        } else if (unknownErrorExisting === false) {
          // Show unknown error (only add unknown error if it isn't in the messages array yet)
          errorMessage = errorMessages.unknownError();
          unknownErrorExisting = true;
        }

        if (errorMessage !== undefined) {
          messages.push(errorMessage);
        }
      });
    }

    setMessages(messages);
    setOpen(messages.length > 0);
  };

  const handleClose = (): void => {
    setOpen(false);

    setTitle(defaultTitle);
    setMessages([]);
    setError(undefined);
  };

  return {
    errorDialogApi: {
      showApolloError,
    },
    errorDialog: <ErrorDialog open={open} onClose={handleClose} title={title} messages={messages} errorResponse={error} />,
  };
};

interface ErrorDialogProviderProps {
  errorDialog?: React.ReactElement<ErrorDialogProps>;
  errorDialogApi?: ErrorDialogApi;
}

export const ErrorDialogProvider: React.FunctionComponent<ErrorDialogProviderProps> = ({
  children,
  errorDialog: customErrorDialog,
  errorDialogApi: customErrorDialogApi,
}) => {
  const { errorDialog: internalErrorDialog, errorDialogApi: internalErrorDialogApi } = useErrorDialog();

  const errorDialog = customErrorDialog ?? internalErrorDialog;
  const errorDialogApi = customErrorDialogApi ?? internalErrorDialogApi;

  return (
    <ErrorDialogContext.Provider value={errorDialogApi}>
      {children}
      {errorDialog}
    </ErrorDialogContext.Provider>
  );
};

export const useErrorDialogApi = (): ErrorDialogApi => {
  return React.useContext(ErrorDialogContext);
};
