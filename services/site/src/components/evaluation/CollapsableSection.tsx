import clsx from "clsx";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

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
  const [showDescription, setShowDescription] = useState(false);

  const AnimatedChevron = animated(Chevron);

  // any is necessary here because the types of react-spring are somehow messed up
  const { transform }: any = useSpring({
    transform: showDescription ? "rotate(0deg)" : "rotate(180deg)",
    config: {
      tension: 0,
      delay: 0,
    },
  });

  return (
    <>
      <div className="h-14 w-14 flex justify-center items-center mr-20">
        {passed ? <Check className="h-9 w-14 text-success" /> : <X className="h-10 w-10 text-error" />}
        {passed ? (
          <p className="sr-only">The following requirement is fulfilled:</p>
        ) : (
          <p className="sr-only">The following requirement is not fulfilled:</p>
        )}
      </div>

      <div className="flex flex-col col-start-2 col-span-5">
        <h3>
          <Button
            onClick={() => {
              setShowDescription((prevShowDescription) => !prevShowDescription);
            }}
            className={clsx("h4 flex flex-row-reverse py-3 px-4 group", "transition duration-300 hover:text-primaryLight", className)}
            overrideClassname
            aria-expanded={showDescription}
            iconRight={
              <AnimatedChevron style={{ transform: transform }} className={clsx("text-light mr-8", "group-hover:text-primaryLight", className)} />
            }
          >
            {title}
          </Button>
        </h3>
        <div hidden={!showDescription}>
          <p className="ml-20 my-4">{description}</p>
        </div>
      </div>
    </>
  );
};

export default CollapsibleSection;
