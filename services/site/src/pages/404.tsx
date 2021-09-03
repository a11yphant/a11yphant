import IllustrationLostSpace from "app/components/icons/IllustrationLostSpace";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Custom404: React.FunctionComponent = () => {
  return (
    <>
      <main className="h-main p-4 box-border">
        <section className="mx-24 py-8 h-main flex justify-between items-center">
          <div>
            <h2 className={clsx("font-normal mb-4", "h4")}>Error 404</h2>
            <p className="text-6xl max-w-lg font-bold leading-tight">seems like you got lost in space</p>
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
          <IllustrationLostSpace className="max-w-xl mx-8 col-span-1" />
        </section>
      </main>
    </>
  );
};

export default Custom404;
