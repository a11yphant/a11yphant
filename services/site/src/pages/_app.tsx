import "app/styles/global.scss";

import { ApolloProvider } from "@apollo/client";
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
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
