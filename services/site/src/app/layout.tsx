import "app/styles/nprogress.scss";
import "app/styles/global.scss";
import "app/styles/fonts.scss";
import "app/styles/custom.scss";
import "focus-visible/dist/focus-visible";

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { getClientConfig } from "app/lib/config/rsc";
import Script from "next/script";

import ClientProviders from "./ClientProviders";

const RootLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const plausibleUrl = process.env.SITE_PLAUSIBLE_BASE_URL;
  const domain = process.env.SITE_HOST;

  loadDevMessages();
  loadErrorMessages();

  return (
    <html lang="en">
      <head>{plausibleUrl && <Script data-domain={domain} src="/js/script.js" />}</head>
      <body>
        <ClientProviders config={getClientConfig()}>{children}</ClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;
