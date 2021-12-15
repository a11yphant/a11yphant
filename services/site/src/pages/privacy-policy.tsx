import Footer from "app/components/Footer";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import Head from "next/head";
import React from "react";

const PrivacyPolicy: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Details about the privacy policy of a11yphant." />
        <meta property="og:title" content="Privacy Policy" />
        <meta property="og:description" content="Details about the privacy policy of a11yphant." />
        <meta property="og:image" content="/images/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        <meta property="og:locale" content="en" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.a11yphant.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("box-border max-w-screen-3xl mx-auto")}>
        <div className={clsx("max-w-screen-3xl mx-8 mt-32 mb-24", "sm:mx-12 sm:mt-28 sm:mb-12", "md:mx-24", "2xl:mx-auto")}>
          <h1>Privacy Policy</h1>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
