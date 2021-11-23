import Footer from "app/components/Footer";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import Head from "next/head";
import React from "react";

const Imprint: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Imprint</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Navigation />
      <main className="box-border max-w-screen-3xl mx-auto">
        <div className={clsx("max-w-screen-3xl mx-8 mt-32 mb-24", "sm:mx-12 sm:mt-28 sm:mb-12 md:mx-24 2xl:mx-auto")}>
          <h1>Imprint</h1>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Imprint;