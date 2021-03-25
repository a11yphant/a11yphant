import "app/styles/global.scss";

import { ApolloProvider } from "@apollo/client";
import Navigation from "app/components/Navigation";
import { useApollo } from "app/lib/apolloClient";
import ChallengeContextProvider from "app/lib/ChallengeContext";
import React from "react";

interface AppProps {
  Component: React.JSXElementConstructor<any>;
  pageProps: any;
}

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ChallengeContextProvider>
        <div className="w-screen h-screen">
          <Navigation />
          <Component {...pageProps} />
        </div>
      </ChallengeContextProvider>
    </ApolloProvider>
  );
};

export default App;
