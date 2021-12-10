import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import sanitizeHtml from "sanitize-html";

import Button from "../buttons/Button";
import Check from "../icons/Check";
import Chevron from "../icons/Chevron";
import X from "../icons/X";
interface CollapsibleSectionProps {
  className?: string;
  passed: boolean;
  title: string;
  description: string;
}

const CollapsibleSection: React.FunctionComponent<CollapsibleSectionProps> = ({ className, passed, title, description }) => {
  const [showDescription, setShowDescription] = useState(!passed);

  const prefersReducedMotion = usePrefersReducedMotion();
  const AnimatedChevron = animated(Chevron);

  // any is necessary here because the types of react-spring are somehow messed up
  const { transform }: any = useSpring({
    transform: showDescription && !prefersReducedMotion ? "rotate(0deg)" : "rotate(180deg)",
    config: {
      immediate: true,
      tension: 0,
      delay: 0,
    },
  });

  return (
    <>
      <div className={clsx("h-14 w-14 mr-8  ml-0 lg:ml-8 flex justify-center items-center", "lg:mr-20 lg:ml-8")}>
        {passed ? <Check className={clsx("h-9 w-14 text-success")} /> : <X className={clsx("h-10 w-10 text-error")} />}
        {passed ? (
          <p className={clsx("sr-only")}>The following requirement is fulfilled:</p>
        ) : (
          <p className={clsx("sr-only")}>The following requirement is not fulfilled:</p>
        )}
      </div>

      <div className={clsx("flex flex-col col-start-2 col-span-9")}>
        <h3>
          <Button
            onClick={() => {
              setShowDescription((prevShowDescription) => !prevShowDescription);
            }}
            className={clsx(
              "py-3 pl-4 flex flex-row-reverse",
              "group transition duration-300",
              "hover:text-primary-light",
              "focus:text-primary-light",
              "h4",
              className,
            )}
            overrideClassName
            aria-expanded={showDescription}
          >
            <span className={clsx("h4 prose prose-2xl text-left")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />
            <AnimatedChevron
              style={{ transform: transform }}
              className={clsx("mr-8 text-light flex-shrink-0", "group-hover:text-primary-light", "group-focus:text-primary-light", className)}
            />
          </Button>
        </h3>
        <div hidden={!showDescription}>
          <p className={clsx("ml-20 my-4", "prose")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
        </div>
      </div>
    </>
  );
};

export default CollapsibleSection;
