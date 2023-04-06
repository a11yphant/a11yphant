import { UserAccountBox } from "app/components/user/UserAccountBox";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Hero: React.FC = () => {
  return (
    <div
      className={clsx(
        "max-w-screen-3xl mx-8 mt-16 mb-24 flex flex-col",
        "sm:m-12 sm:mt-20",
        "md:mx-24",
        "xl:min-h-[85vh] xl:flex-row xl:items-center",
        "2xl:mx-auto",
      )}
    >
      <section className={clsx("flex flex-col justify-center mb-24", "md:mb-4", "xl:shrink xl:grow xl:mb-0", "2xl:ml-24")}>
        <h2
          className={clsx("mb-6 max-w-2xl font-bold font-sans text-3xl leading-tight", "sm:text-4xl sm:leading-snug", "xl:text-5xl xl:leading-snug")}
        >
          Learn to code <br /> accessibly with <br /> <span className="sr-only">allyphant</span>
          <span aria-hidden="true">a11yphant</span>.
        </h2>
        <p className={clsx("text-grey-middle text-lg max-w-[36ch]")}>
          <span className="sr-only">allyphant</span>
          <span aria-hidden="true" className="text-grey-middle">
            a11yphant
          </span>{" "}
          teaches web accessibility, one step at a time, broken down into manageable pieces. We call these challenges.
        </p>
        <Link href="/#challenges">
          <a
            className={clsx(
              "w-max mt-8 px-6 py-2.5 font-medium bg-primary text-light border-primary border-2 rounded tracking-wider inline-flex items-center",
              "transition duration-300",
              "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
            )}
          >
            Start Coding
          </a>
        </Link>
      </section>
      <section
        className={clsx(
          "p-8 bg-primary rounded-lg",
          "md:hidden",
          "xl:block xl:px-20 xl:py-16 xl:max-w-xl xl:ml-12 xl:self-center xl:shrink-0",
          "2xl:mr-24",
        )}
      >
        <h2
          className={clsx(
            "mb-8 max-w-2xl font-bold font-sans text-3xl leading-tight",
            "sm:text-4xl sm:leading-snug",
            "xl:mr-0 xl:mb-10 xl:text-5xl xl:leading-snug",
          )}
        >
          Sign up to save your progress!
        </h2>
        <UserAccountBox mode="signup" />
      </section>
    </div>
  );
};

export default Hero;
