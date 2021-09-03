import IllustrationLostSpace from "app/components/icons/IllustrationLostSpace";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Custom404: React.FunctionComponent = () => {
  return (
    <>
      <main className="h-main box-border max-w-screen-3xl mx-auto">
        <section
          className={clsx("mx-8 py-8 h-main flex flex-col justify-center items-left", "md:flex-row md:items-center md:justify-between", "lg:mx-24")}
        >
          <div>
            <h2 className={clsx("font-normal mb-4", "h5", "sm:h4")}>Error 404</h2>
            <p className={clsx("text-3xl max-w-lg font-bold leading-tight", "md:text-4xl", "xl:text-6xl")}>seems like you got lost in space</p>
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
          <IllustrationLostSpace
            className={clsx("max-w-xs mt-24 col-span-1 self-start", "md:mt-0 md:mx-8 md:self-center", "lg:max-w-xl", "2xl:max-w-4xl")}
          />
        </section>
      </main>
    </>
  );
};

export default Custom404;
