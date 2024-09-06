import clsx from "clsx";
import React from "react";

import Education from "../icons/Education";
import Money from "../icons/Money";
import Monitor from "../icons/Monitor";

const IconSection: React.FunctionComponent<React.PropsWithChildren> = () => {
  return (
    <section className={clsx("flex flex-col items-center", "sm:my-20", "xl:my-28")}>
      <h2 className={clsx("h4 mb-10", "sm:h3 sm:max-w-[38ch] xs:text-center", "xl:h2 xl:max-w-[38ch]")}>
        We believe that{" "}
        <strong className={clsx("text-primary-text h4", "sm:h3 sm:leading-snug sm:text-primary-text", "xl:h2 xl:leading-snug xl:text-primary-text")}>
          education
        </strong>{" "}
        on digital accessibility should be available to all.
      </h2>
      <div className={clsx("flex flex-col justify-center xs:flex-row xs:flex-wrap", "lg:mt-8")}>
        <div className={clsx("flex flex-col items-center")}>
          <Money />
          <p
            className={clsx(
              "block py-1.5 px-4 mb-8 mt-4 text-light font-medium not-italic uppercase tracking-[0.18rem] text-center text-sm max-w-[33ch]",
            )}
          >
            All Challenges on our platform are free.
          </p>
        </div>
        <div className={clsx("flex flex-col items-center")}>
          <Education />
          <p
            className={clsx(
              "block py-1.5 px-4 mb-8 mt-4 text-light font-medium not-italic uppercase tracking-[0.18rem] text-center text-sm max-w-[33ch]",
            )}
          >
            No account needed. Just start learning.
          </p>
        </div>
        <div className={clsx("flex flex-col items-center")}>
          <Monitor />
          <p
            className={clsx("block py-1.5 px-4 mt-4 text-light font-medium not-italic uppercase tracking-[0.18rem] text-center text-sm max-w-[33ch]")}
          >
            a11yphant is an Open Source Project.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IconSection;
