"use client";

import "focus-visible/dist/focus-visible";

import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";
import { ErrorDialogProvider, useErrorDialog } from "app/components/common/error/useErrorDialog";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import { UserAccountModalProvider } from "app/components/user/UserAccountModalProvider";
import { createApolloClient } from "app/lib/apollo-client/create-apollo-client-ssr";
import { ClientConfig, ConfigProvider } from "app/lib/config";
import Router from "next/router";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const ClientProviders: React.FC<React.PropsWithChildren<{ config: ClientConfig }>> = ({ config, children }) => {
  const { errorDialog, errorDialogApi } = useErrorDialog();
  const apolloClient = createApolloClient(config.graphqlEndpointPath, null, errorDialogApi);

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
