import ErrorWithIllustration from "app/components/ErrorWithIllustration";
import Footer from "app/components/Footer";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import Head from "next/head";
import React from "react";

const Custom404: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>404 Page not found | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <FullScreenLayout header={<Navigation />} footer={<Footer />}>
        <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
          <div className={clsx("mx-8 py-8 h-main", "lg:mx-24")}>
            <ErrorWithIllustration error="Error 404" text="seems like you got lost in space" />
          </div>
        </main>
      </FullScreenLayout>
    </>
  );
};

export default Custom404;
