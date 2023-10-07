"use client";

import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support/ssr";
import { ErrorDialogProvider, useErrorDialog } from "app/components/common/error/useErrorDialog";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import { UserAccountModalProvider } from "app/components/user/UserAccountModalProvider";
import { createApolloClientSSR } from "app/lib/apollo-client";
import { ClientConfig, ConfigProvider } from "app/lib/config";

const ClientProviders: React.FC<React.PropsWithChildren<{ config: ClientConfig }>> = ({ config, children }) => {
  const { errorDialog, errorDialogApi } = useErrorDialog();
  const apolloClient = createApolloClientSSR(config.graphqlEndpointClient, errorDialogApi);

  return (
    <>
      <ConfigProvider value={config}>
        <ErrorDialogProvider errorDialog={errorDialog} errorDialogApi={errorDialogApi}>
          <ApolloNextAppProvider makeClient={() => apolloClient}>
            <FlashMessageContextProvider>
              <UserAccountModalProvider>{children}</UserAccountModalProvider>
            </FlashMessageContextProvider>
          </ApolloNextAppProvider>
        </ErrorDialogProvider>
      </ConfigProvider>
    </>
  );
};

export default ClientProviders;
