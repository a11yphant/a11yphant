import Footer from "app/components/Footer";
import IllustrationLost from "app/components/icons/IllustrationLost";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

interface CustomErrorProps {
  statusCode: number;
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

const CustomError: NextPage<CustomErrorProps> = ({ statusCode, hasGetInitialPropsRun = false, err }) => {
  return (
    <>
      <Head>
        <title>Something went wrong | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
        <section
          className={clsx("mx-8 py-8 h-full flex flex-col justify-center items-left", "md:flex-row md:items-center md:justify-between", "lg:mx-24")}
        >
          <div>
            <h1 className={clsx("font-normal mb-4", "h5", "sm:h4")}>Error {statusCode}</h1>
            <p className={clsx("text-3xl max-w-lg font-bold leading-tight", "md:text-4xl", "xl:text-6xl")}>ooops, something went wrong</p>
            <Link href="/">
              <a
                className={clsx(
                  "w-max mt-8 px-6 py-2.5 font-normal bg-primary text-light border-primary border-2 rounded tracking-wider inline-flex items-center",
                  "transition duration-300",
                  "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
                )}
              >
                Go to homepage
              </a>
            </Link>
          </div>
          <IllustrationLost
            className={clsx("max-w-xs mt-24 col-span-1 self-start", "md:mt-0 md:mx-8 md:self-center", "lg:max-w-xl", "2xl:max-w-4xl")}
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, err, hasGetInitialPropsRun: true };
};

export default CustomError;
