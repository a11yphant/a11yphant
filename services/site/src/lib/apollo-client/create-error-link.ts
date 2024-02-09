import { ApolloLink } from "@apollo/client/link/core";
import { onError } from "@apollo/client/link/error";
import { ErrorScope, errorScopeForOperationContext } from "app/components/common/error/ErrorScope";
import { ErrorDialogApi } from "app/components/common/error/useErrorDialog";

interface CreateErrorLinkProps {
  errorDialogApi?: ErrorDialogApi;
}

export const createErrorLink = ({ errorDialogApi }: CreateErrorLinkProps): ApolloLink => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (errorDialogApi) {
      const errorScope = errorScopeForOperationContext(operation.getContext());

      if (errorScope === ErrorScope.Global) {
        if ((graphQLErrors && graphQLErrors.length > 0) || networkError) {
          errorDialogApi.showApolloError({ graphQLErrors, networkError });
        }
      }
    }
  });
};
