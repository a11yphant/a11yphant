import getConfig from "next/config";
import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

const Document: React.FunctionComponent = () => {
  const { publicRuntimeConfig } = getConfig();

  return (
    <Html lang="en">
      <Head>{publicRuntimeConfig.isPlausibleEnabled && <script defer data-domain={publicRuntimeConfig.domain} src="/js/script.js" />}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
