import { ApolloError } from "@apollo/client";
import ErrorDialog, { ErrorDialogProps } from "app/components/common/error/ErrorDialog";
import { errorMessages } from "app/components/common/error/errorMessages";
import { GraphQLError } from "graphql";
import React from "react";

export type ApolloErrorResponse = Pick<ApolloError, "graphQLErrors" | "networkError">;

interface ErrorDialogOptions {
  title?: string;
  defaultMessage?: React.ReactNode;
  specificMessages?: {
    [key: string]: React.ReactNode;
  };
}

export interface ErrorDialogApi {
  showApolloError: (error: ApolloErrorResponse, options?: ErrorDialogOptions) => void;
}

const ErrorDialogContext = React.createContext<ErrorDialogApi>({
  showApolloError: () => {
    throw new Error("Error Dialog used outside ErrorDialogContext");
  },
});

const getMessageForGraphQLError = (graphQLError: GraphQLError, options: ErrorDialogOptions): React.ReactNode => {
  if (options?.specificMessages?.[graphQLError.extensions.code]) {
    // Show error message for this error code if it has been defined
    return options?.specificMessages?.[graphQLError.extensions.code];
  } else if (graphQLError.message.length > 0) {
    // Show error message from API if it exists
    return graphQLError.message;
  } else if (options?.defaultMessage) {
    // Show default error message if it has been defined
    return options?.defaultMessage;
  } else {
    // Show unknown error
    return errorMessages.unknownError();
  }
};

const defaultTitle = "An error occurred :(";

export const useErrorDialog = (): { errorDialog: React.ReactElement<ErrorDialogProps>; errorDialogApi: ErrorDialogApi } => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(defaultTitle);
  const [messages, setMessages] = React.useState<Array<React.ReactNode>>([]);
  const [error, setError] = React.useState<ApolloErrorResponse>();

  const showApolloError = ({ graphQLErrors, networkError }: ApolloErrorResponse, options?: ErrorDialogOptions): void => {
    setTitle(options?.title ?? defaultTitle);
    setError({ graphQLErrors, networkError });

    let messages = [];

    if (networkError) {
      messages = [errorMessages.networkError()];
    } else if (graphQLErrors) {
      messages = graphQLErrors.map((graphQLError) => getMessageForGraphQLError(graphQLError, options));
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
