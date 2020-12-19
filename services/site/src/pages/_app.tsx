import "app/styles/global.scss";

import { ApolloProvider } from "@apollo/client";
import React from "react";

import { useApollo } from "../lib/apolloClient";

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
