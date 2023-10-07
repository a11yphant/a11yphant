import clsx from "clsx";
import Link from "next/link";
import React from "react";

const TopChallengeSection: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <section className={clsx("flex flex-col items-center my-12 p-12 container-dark", "sm:my-20", "xl:my-24")}>
      <h2 className={clsx("text-center h4 mb-10", "sm:h3", "xl:h2")}>Our three most popular challenges</h2>
      <div className={clsx("flex flex-col justify-center xs:flex-row xs:flex-wrap")}>{children}</div>
      <Link
        href="/challenges"
        className={clsx(
          "w-max mt-8 px-6 py-2.5 font-medium bg-primary text-light border-primary border-2 rounded tracking-wider inline-flex items-center",
          "transition duration-300",
          "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
        )}
      >
        Start now for free
      </Link>
    </section>
  );
};

export default TopChallengeSection;
