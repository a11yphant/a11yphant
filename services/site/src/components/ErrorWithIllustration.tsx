import clsx from "clsx";
import Link from "next/link";
import React from "react";

import IllustrationLostSpace from "./icons/IllustrationLostSpace";

interface ErrorWithIllustrationProps {
  error: string;
  text: string;
}

const ErrorWithIllustration: React.VFC<ErrorWithIllustrationProps> = ({ error, text }) => (
  <>
    <div className={clsx("flex flex-col justify-center items-left", "md:flex-row md:items-center md:justify-between")}>
      <div>
        <h1 className={clsx("font-normal mb-4", "h5", "sm:h4")}>{error}</h1>
        <p className={clsx("text-3xl max-w-lg font-bold leading-tight", "md:text-4xl", "xl:text-6xl")}>{text}</p>
        <Link
          href="/"
          className={clsx(
            "w-max mt-8 px-6 py-2.5 font-normal bg-primary text-light border-primary border-2 rounded tracking-wider inline-flex items-center",
            "transition duration-300",
            "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
          )}
        >
          Go to homepage
        </Link>
      </div>
      <IllustrationLostSpace className={clsx("hidden", "md:block md:w-full md:mt-0 md:mx-8", "lg:max-w-xl", "2xl:max-w-4xl")} />
    </div>
  </>
);

export default ErrorWithIllustration;
