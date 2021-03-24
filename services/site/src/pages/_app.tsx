import "app/styles/global.scss";

import { ApolloProvider } from "@apollo/client";
import { BreadcrumbsContextProvider } from "app/components/breadcrumbs/BreadcrumbsContext";
import { useApollo } from "app/lib/apolloClient";
import React from "react";

interface AppProps {
  Component: React.JSXElementConstructor<any>;
  pageProps: any;
}

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <BreadcrumbsContextProvider>
        <Component {...pageProps} />
      </BreadcrumbsContextProvider>
    </ApolloProvider>
  );
};

export default App;
