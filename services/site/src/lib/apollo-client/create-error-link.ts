import { ApolloLink } from "@apollo/client/link/core";
import { onError } from "@apollo/client/link/error";
import { ErrorDialogApi } from "app/components/common/error/useErrorDialog";

interface CreateErrorLinkProps {
  errorDialogApi: ErrorDialogApi;
}

export const createErrorLink = ({ errorDialogApi }: CreateErrorLinkProps): ApolloLink => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (errorDialogApi) {
      if (graphQLErrors.length > 0 || networkError) {
        errorDialogApi.showApolloError({ graphQLErrors, networkError });
      }
    }
  });
};
