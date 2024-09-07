import "app/styles/nprogress.scss";
import "app/styles/global.scss";
import "app/styles/fonts.scss";
import "app/styles/custom.scss";

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { Analytics } from "@vercel/analytics/react";
import { getClientConfig, getConfig } from "app/lib/config/rsc";
import { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";

import ClientProviders from "./ClientProviders";

const RootLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const host = headers().get("host");
  const config = getConfig(host);

  if (config.isDevelopmentMode) {
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <html lang="en">
      <head>{config.plausibleBaseUrl && <Script data-domain={host} src="/js/script.js" />}</head>
      <body>
        <ClientProviders config={getClientConfig(host)}>{children}</ClientProviders>
        <Analytics />
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
        alt: "A screenshot compilation of the homepage, a quiz and a coding level on a11yphant. The homepage shows an illustration of a person coding and the text `learning web accessibility made easy`. The quiz is multiple choice and the coding level consists of an instruction section, a code editor and a preview section to view the code one has just written.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@a11yphant",
    title: "a11yphant",
    description: "a11yphant is an interactive online course for web accessibility.",
    images: [{ url: "https://a11yphant.com/images/SEO/mockups-social-media.jpg" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
};
