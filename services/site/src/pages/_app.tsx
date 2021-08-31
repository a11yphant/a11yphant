import "app/styles/global.scss";
import "app/styles/nprogress.scss";

import { ApolloProvider } from "@apollo/client";
import Navigation from "app/components/Navigation";
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
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <div className="w-full h-screen">
        <Navigation displayBreadcrumbs={pageProps.displayBreadcrumbs} displaySave={pageProps.displaySave} />
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
};

export default App;
