import clsx from "clsx";
import Link from "next/link";
import React from "react";

const CTASection: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <section
      className={clsx(
        "mb-4 flex flex-col mt-2",
        "xs:mt-6",
        "sm:mb-12 sm:mt-8",
        "md:mt-8 md:flex-row xl:mx-20",
        "xl:mb-24 md:flex-row xl:items-center 2xl:mx-52",
      )}
    >
      <div className={clsx("flex flex-col justify-center", "md:mb-4", "xl:shrink xl:grow xl:mb-0")}>
        <h2 className={clsx("h4 leading-tight", "sm:h3 sm:leading-tight", "md:max-w-[20ch]", "xl:h2 xl:leading-tight xl:max-w-[20ch]")}>
          Start your accessibility journey{" "}
          <strong
            className={clsx("text-primary-text h4", "sm:h3 sm:leading-snug sm:text-primary-text", "xl:h2 xl:leading-snug xl:text-primary-text")}
          >
            today
          </strong>
          .
        </h2>
        <Link
          href="/challenges"
          className={clsx(
            "w-max mt-8 px-6 py-2.5 font-medium bg-primary text-light border-primary border-2 rounded tracking-wider inline-flex items-center",
            "transition duration-300",
            "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
          )}
        >
          Start Coding
        </Link>
      </div>
      <div
        className={clsx("flex justify-end min-w-[46%] mt-4 xs:-mt-20", "md:mt-0", "md:max-w-xs md:justify-center", "lg:max-w-sm", "xl:max-w-full")}
      >
        {children}
      </div>
    </section>
  );
};

export default CTASection;
