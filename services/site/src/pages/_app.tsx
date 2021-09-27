import "app/styles/nprogress.scss";
import "app/styles/global.scss";
import "app/styles/fonts.scss";
import "app/styles/custom.scss";

import { ApolloProvider } from "@apollo/client";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { useApollo } from "app/lib/apollo-client";
import clsx from "clsx";
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
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <div className="w-full h-screen">
        <ScrollOverlayWrapper className={clsx("w-full h-full overflow-auto")} enableTopOverlay={false} classNameBottomOverlay={"w-full h-52"}>
          <Component {...pageProps} />
        </ScrollOverlayWrapper>
      </div>
    </ApolloProvider>
  );
};

export default App;
