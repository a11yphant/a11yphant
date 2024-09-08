import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";

import Button from "../buttons/Button";
import Check from "../icons/Check";
import Chevron from "../icons/Chevron";
import ClosingX from "../icons/ClosingX";

interface CollapsibleSectionProps {
  className?: string;
  passed: boolean;
  title: string;
  description: string;
}

const CollapsibleSection: React.FunctionComponent<CollapsibleSectionProps> = ({ className, passed, title, description }) => {
  const [showDescription, setShowDescription] = useState(!passed);

  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <div
        className={clsx(
          "h-6 w-6 mt-4 mr-4 ml-0 lg:ml-8 flex justify-center items-center",
          "sm:h-10 sm:w-10 sm:mt-2 sm:mr-8",
          "md:h-14 md:w-14 md:mt-0",
          "lg:mr-20 lg:ml-8",
        )}
      >
        {passed ? <Check className={clsx("h-9 w-14 text-success")} /> : <ClosingX className={clsx("h-10 w-10 text-error")} />}
        {passed ? <p className={clsx("sr-only")}>Passed requirement:</p> : <p className={clsx("sr-only")}>Failed requirement:</p>}
      </div>

      <div className={clsx("flex flex-col col-start-2 col-span-9 -ml-5")}>
        <h3>
          <Button
            onClick={() => {
              setShowDescription((prevShowDescription) => !prevShowDescription);
            }}
            className={clsx("py-3 pl-4 flex flex-row-reverse", "group transition duration-300", "hover:text-primary-light", "h4", className)}
            overrideClassName
            aria-expanded={showDescription}
          >
            <span className={clsx("h5 prose prose-2xl text-left", "lg:h4")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />
            <Chevron
              className={clsx(
                "mr-4 lg:mr-8 text-light shrink-0 transition-transform ease-in-out",
                "group-hover:text-primary-light",
                showDescription && !prefersReducedMotion ? "rotate-0" : "rotate-180",
                className,
              )}
            />
          </Button>
        </h3>
        <div hidden={!showDescription}>
          <p className={clsx("ml-16 lg:ml-20 my-4", "prose")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
        </div>
      </div>
    </>
  );
};

export default CollapsibleSection;
