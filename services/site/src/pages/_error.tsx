import IllustrationLost from "app/components/icons/IllustrationLost";
import clsx from "clsx";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

interface CustomErrorProps {
  statusCode: number;
}

const CustomError: NextPage<CustomErrorProps> = ({ statusCode }) => {
  return (
    <>
      <main className="h-main p-4 box-border">
        <section className="mx-24 py-8 h-main flex justify-between items-center">
          <div>
            <h2 className={clsx("font-normal mb-4", "h4")}>Error {statusCode}</h2>
            <p className="text-6xl max-w-lg font-bold leading-tight">ooops, something went wrong</p>
            <Link href="/">
              <a
                className={clsx(
                  "w-max mt-8 px-4 py-2 font-normal bg-primary text-white border-primary border-2 rounded tracking-wider inline-flex items-center",
                  "transition duration-300",
                  "hover:text-white hover:bg-primary-dark hover:border-primary-dark",
                  "focus:text-white focus:bg-primary-dark focus:border-primary-dark",
                )}
              >
                Go to homepage
              </a>
            </Link>
          </div>
          <IllustrationLost className="max-w-md mx-8 col-span-1" />
        </section>
      </main>
    </>
  );
};

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default CustomError;
