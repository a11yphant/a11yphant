import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface USPSectionProps {
  imageLeft?: boolean;
  heading: string;
  paragraph: React.ReactNode;
  displayButton?: boolean;
}
const USPSection: React.FunctionComponent<React.PropsWithChildren<USPSectionProps>> = ({
  children,
  imageLeft = false,
  heading,
  paragraph,
  displayButton = false,
}) => {
  return (
    <section
      className={clsx(
        "my-4 flex flex-col-reverse",
        "xs:my-6",
        "sm:my-8",
        "md:flex-row",
        "xl:my-18 md:flex-row xl:items-center",
        imageLeft && "md:flex-row-reverse",
      )}
    >
      <div
        className={clsx(
          "flex flex-col lg:justify-center",
          "md:mb-4",
          "xl:shrink xl:grow xl:mb-0",
          imageLeft && "md:ml-8 lg:ml-20",
          !imageLeft && "md:items-end",
        )}
      >
        <h2
          className={clsx(
            "mb-4 h4 leading-tight",
            "sm:h3 sm:leading-tight",
            "xl:h2 xl:leading-tight",
            imageLeft && "md:max-w-[18ch] xl:max-w-[18ch]",
            !imageLeft && "md:text-right lg:max-w-xl",
          )}
        >
          {heading}
        </h2>
        <p className={clsx("text-grey-middle text-lg mb-6", imageLeft && "max-w-[60ch]", !imageLeft && "md:text-right lg:max-w-xl")}>{paragraph}</p>
        {displayButton && (
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
        )}
      </div>
      <div
        className={clsx(
          "flex justify-start min-w-[46%]",
          "md:max-w-xs",
          "lg:max-w-sm",
          "xl:max-w-full",
          imageLeft && "lg:justify-end lg:pr-12",
          !imageLeft && "md:ml-12 lg:justify-start lg:pl-12",
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default USPSection;
