import { UserAccountBox } from "app/components/user/UserAccountBox";
import clsx from "clsx";
import React from "react";

const SignUpSection: React.FC = () => {
  return (
    <div
      className={clsx(
        "max-w-screen-3xl mx-8 my-12 flex flex-col",
        "sm:m-12 sm:mt-20",
        "md:mx-24 md:mt-16",
        "lg:flex-row",
        "xl:mb-24 xl:min-h-[85vh] xl:items-center",
        "2xl:mx-auto",
      )}
    >
      <section className={clsx("flex flex-col justify-center", "sm:mr-20", "md:mr-10", "lg:mr-18", "xl:ml-2 xl:mr-8", "2xl:ml-20 2xl:mr-24")}>
        <h2 className={clsx("mb-6 max-w-2xl h4 leading-tight", "md:h3 md:leading-snug", "lg:text-right", "2xl:h2 xl:leading-snug")}>
          Join{" "}
          <strong
            className={clsx("text-primary-text h4", "md:h3 md:leading-snug md:text-primary-text", "2xl:h2 xl:leading-snug xl:text-primary-text")}
          >
            1500+ other registered users
          </strong>{" "}
          and be part of the <span className="sr-only">allyphant</span>
          <span aria-hidden="true">a11yphant</span> community.
        </h2>
      </section>
      <section
        className={clsx(
          "p-8 bg-primary rounded-lg min-w-fit",
          "xl:block xl:px-20 xl:py-16 xl:max-w-xl xl:ml-12 xl:self-center xl:shrink-0",
          "2xl:mr-24",
        )}
      >
        <h2
          className={clsx(
            "mb-8 max-w-md font-bold font-sans text-3xl leading-tight",
            "sm:text-4xl sm:leading-snug",
            "xl:mr-0 xl:mb-10 xl:text-5xl xl:leading-snug xl:max-w-lg",
          )}
        >
          Sign up to save your progress!
        </h2>
        <UserAccountBox mode="signup" />
      </section>
    </div>
  );
};

export default SignUpSection;
