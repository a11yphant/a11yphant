import "app/styles/nprogress.scss";
import "app/styles/global.scss";
import "app/styles/fonts.scss";
import "app/styles/custom.scss";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogProvider, useErrorDialog } from "app/components/common/error/useErrorDialog";
import { UserAccountModalProvider } from "app/components/user/UserAccountModalProvider";
import { useApollo } from "app/lib/apollo-client";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";
interface AppProps {
  Component: React.JSXElementConstructor<any>;
  pageProps: any;
}

NProgress.configure({
  showSpinner: false,
});
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { errorDialog, errorDialogApi } = useErrorDialog();
  const apolloClient = useApollo(pageProps.initialApolloState, errorDialogApi);

  return (
    <ErrorDialogProvider errorDialog={errorDialog} errorDialogApi={errorDialogApi}>
      <ApolloProvider client={apolloClient}>
        <UserAccountModalProvider>
          <div className="w-full h-screen">
            <Component {...pageProps} />
          </div>
        </UserAccountModalProvider>
      </ApolloProvider>
    </ErrorDialogProvider>
  );
};

export default App;
