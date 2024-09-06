import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

const Document: React.FunctionComponent = () => {
  return (
    <Html lang="en">
      <Head></Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
