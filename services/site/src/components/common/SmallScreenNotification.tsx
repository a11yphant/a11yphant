import clsx from "clsx";
import Link from "next/link";
import React from "react";

import IllustrationCodingMan from "../icons/IllustrationCodingMan";

const SmallScreenNotification: React.FunctionComponent = () => {
  return (
    <>
      <section className={clsx("mx-8 py-10 h-full flex flex-col justify-center items-left", "md:hidden")}>
        <IllustrationCodingMan className={clsx("max-w-xs mb-12 self-start", "sm:mb-12 sm:max-w-sm")} />
        <h2 className={clsx("mb-8", "h3", "sm:h2")}>Your device is too small</h2>
        <p>Please use a tablet or desktop device with a larger screen.</p>
        <Link href="/">
          <a
            className={clsx(
              "w-max mt-4 px-4 py-2 font-normal bg-primary text-white border-primary border-2 rounded tracking-wider inline-flex items-center",
              "transition duration-300",
              "hover:text-white hover:bg-primary-dark hover:border-primary-dark",
              "focus:text-white focus:bg-primary-dark focus:border-primary-dark",
            )}
          >
            Go to homepage
          </a>
        </Link>
      </section>
    </>
  );
};

export default SmallScreenNotification;
