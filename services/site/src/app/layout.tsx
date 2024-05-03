import "app/styles/nprogress.scss";
import "app/styles/global.scss";
import "app/styles/fonts.scss";
import "app/styles/custom.scss";
import "focus-visible/dist/focus-visible";

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { getClientConfig, getConfig } from "app/lib/config/rsc";
import { Metadata } from "next";
import Script from "next/script";

import ClientProviders from "./ClientProviders";

const RootLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const config = getConfig();

  if (config.isDevelopmentMode) {
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <html lang="en">
      <head>{config.plausibleBaseUrl && <Script data-domain={config.host} src="/js/script.js" />}</head>
      <body>
        <ClientProviders config={getClientConfig()}>{children}</ClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;

export const metadata: Metadata = {
  description:
    "a11yphant is the easy way to learn the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes.",
  openGraph: {
    url: "https://a11yphant.com",
    type: "website",
    locale: "en",
    title: "a11yphant",
    description:
      "a11yphant is the easy way to learn the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes.",
    images: [
      {
        url: "https://a11yphant.com/images/SEO/mockups-social-media.jpg",
        alt: "A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written.",
      },
    ],
  },
  twitter: {
    site: "@a11yphant",
    title: "a11yphant",
    description: "a11yphant is an interactive online course for web accessibility.",
    images: [{ url: "https://a11yphant.com/images/SEO/mockups-social-media.jpg" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
};
