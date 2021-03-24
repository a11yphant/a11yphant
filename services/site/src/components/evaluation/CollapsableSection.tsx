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

  const AnimatedIcon = animated(Chevron);

  const openSectionStyle = {
    icon: {
      transform: "rotate(0deg)",
      tension: 0,
      delay: 0,
      easing: "d3-ease",
    },
  };

  const closedSectionStyle = {
    icon: {
      transform: "rotate(180deg)",
      tension: 0,
      delay: 0,
      easing: "d3-ease",
    },
  };

  // any is necessary here because the types of react-spring are somehow messed up
  const animation: any = useSpring({
    iconTransform: showDescription ? closedSectionStyle.icon.transform : openSectionStyle.icon.transform,
    config: {
      duration: 300,
    },
  });

  return (
    <div className={`${className} flex flex-row items-start w-full box-border py-2`}>
      <div className="flex flex-col w-full">
        <h4>
          <Button
            onClick={() => {
              setShowDescription((prevShowDescription) => !prevShowDescription);
            }}
            className="h3 flex flex-row-reverse m-0 py-4 pr-4 group text-white font-bold transition duration-300 hover:text-primaryDark focus:text-primaryDark"
            overrideClassname
            aria-expanded={showDescription}
            icon={
              <AnimatedIcon
                style={{ transform: animation.iconTransform }}
                className="text-white mr-8 group-hover:text-primaryDark group-focus:text-primaryDark"
              />
            }
          >
            {title}
          </Button>
        </h4>
        <div hidden={!showDescription}>
          <p className="text-white ml-16 my-4">{description}</p>
        </div>
      </div>
      {passed ? <Check className="h-20 w-20 text-white ml-10" /> : <X className="h-20 w-20 text-white ml-10" />}
    </div>
  );
};

export default CollapsibleSection;
