import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Github from "../icons/Github";

const Hero: React.FC = () => {
  return (
    <div
      className={clsx(
        "max-w-screen-3xl mx-8 mt-12 mb-24 flex flex-col",
        "sm:m-12",
        "md:mx-24",
        "xl:h-main xl:flex-row xl:items-center",
        "2xl:mx-auto",
      )}
    >
      <section className={clsx("flex flex-col justify-center mb-24", "xl:flex-shrink xl:flex-grow xl:mb-0", "2xl:ml-24")}>
        <h2
          className={clsx("mb-6 max-w-2xl font-bold font-sans text-3xl leading-tight", "sm:text-4xl sm:leading-snug", "xl:text-5xl xl:leading-snug")}
        >
          Learning web accessibility made easy
        </h2>
        <p className={clsx("text-grey-middle text-lg")}>
          a11yphant teaches web accessibility, one step at a time, broken down into manageable pieces. We call these challenges. You won't need to
          read large amounts of text to complete those. Instead, you will learn by applying the concepts in code. Get started with your first web
          accessibility challenge and improve your skills.
        </p>
        <Link href="/#challenges">
          <a
            className={clsx(
              "w-max mt-8 px-4 py-2 font-normal bg-primary text-light border-primary border-2 rounded tracking-wider inline-flex items-center",
              "transition duration-300",
              "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
              "focus:text-light focus:bg-primary-dark focus:border-primary-dark",
            )}
          >
            Start Coding
          </a>
        </Link>
      </section>
      <section
        className={clsx(
          "p-8 bg-primary rounded-lg",
          "md:px-12 md:py-10",
          "lg:items-center lg:px-16 lg:py-14",
          "xl:block xl:px-20 xl:py-16 xl:max-w-xl xl:ml-12 xl:self-center xl:flex-shrink-0",
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
        <div className={clsx("max-w-full block")}>
          <a
            href={process.env.NEXT_PUBLIC_SITE_GITHUB_LOGIN_ENDPOINT || "/auth/github"}
            className={clsx(
              "px-8 py-4 w-full max-w-xs block text-center align-middle text-light font-normal leading-none rounded border border-light",
              "transition duration-300 group",
              "hover:bg-light hover:text-primary",
              "xl:max-w-none",
            )}
          >
            Sign up via Github
            <Github className={clsx("inline-block h-6 -m-2 ml-6 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Hero;
