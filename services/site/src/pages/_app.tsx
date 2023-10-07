import "app/styles/nprogress.scss";
import "app/styles/global.scss";
import "app/styles/fonts.scss";
import "app/styles/custom.scss";
import "focus-visible/dist/focus-visible";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogProvider, useErrorDialog } from "app/components/common/error/useErrorDialog";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import ScrollOverlayWrapper, { ScrollOverlayWrapperProps } from "app/components/common/ScrollOverlayWrapper";
import { UserAccountModalProvider } from "app/components/user/UserAccountModalProvider";
import { useApollo } from "app/lib/apollo-client";
import { ConfigProvider } from "app/lib/config";
import Head from "next/head";
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

type ConditionalWrapperProps<T> = T & {
  condition: boolean;
  Wrapper: React.FC<React.PropsWithChildren>;
  children: React.ReactElement;
};

const ConditionalWrapper = <T,>({
  condition,
  Wrapper,
  children,
  ...otherProps
}: React.PropsWithChildren<ConditionalWrapperProps<T>>): React.ReactElement => {
  return condition ? <Wrapper {...otherProps}>{children}</Wrapper> : children;
};

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const { errorDialog, errorDialogApi } = useErrorDialog();
  const apolloClient = useApollo(pageProps.config.graphqlEndpointClient, pageProps.initialApolloState, errorDialogApi);

  return (
    <>
      <Head>{pageProps.config.isPlausibleEnabled && <script defer data-domain={pageProps.config.domain} src="/js/script.js" />}</Head>
      <ConfigProvider value={pageProps.config}>
        <ErrorDialogProvider errorDialog={errorDialog} errorDialogApi={errorDialogApi}>
          <ApolloProvider client={apolloClient}>
            <FlashMessageContextProvider>
              <UserAccountModalProvider>
                <ConditionalWrapper<ScrollOverlayWrapperProps>
                  condition={pageProps.showScrollOverlay ?? true}
                  Wrapper={ScrollOverlayWrapper}
                  enableTopOverlay={false}
                  enableBottomOverlay={true}
                  classNameBottomOverlay={"h-52 -mt-52"}
                  attachScrollListenerToDocument
                >
                  <Component {...pageProps} />
                </ConditionalWrapper>
              </UserAccountModalProvider>
            </FlashMessageContextProvider>
          </ApolloProvider>
        </ErrorDialogProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
