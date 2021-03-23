import React, { useState } from "react";

import Button from "../buttons/Button";
import Check from "../icons/Check";
import Chevron from "../icons/Chevron";
import X from "../icons/X";

interface CollapsibleSectionProps {
  className?: string;
  passed: boolean;
}

const CollapsibleSection: React.FunctionComponent<CollapsibleSectionProps> = ({ className, passed }) => {
  const [showDescription, setShowDescription] = useState(false);

  const showDetails = (): void => {
    setShowDescription((prevShowDescription) => !prevShowDescription);
  };

  return (
    <div className={`${className} flex flex-row items-start w-full box-border py-2`}>
      <div className="flex flex-col w-full">
        <h4>
          <Button
            onClick={showDetails}
            className="h3 flex flex-row-reverse m-0 py-4 pr-4 group text-white font-bold transition duration-300 hover:text-primaryDark focus:text-primaryDark"
            overrideClassname
            aria-expanded={showDescription}
            icon={<Chevron className="text-white mr-8 group-hover:text-primaryDark group-focus:text-primaryDark" />}
          >
            1.1 Global Requirements
          </Button>
        </h4>
        <div hidden={!showDescription}>
          <p className="text-white ml-16 my-4">
            The HTML code must comply to all markup rules established by the W3C. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus
            donec mattis sit accumsan, pulvinar in felis, vel arcu. Eu pellentesque purus amet, nibh eget.
          </p>
        </div>
      </div>
      {passed ? <Check className="h-20 w-20 text-white ml-10" /> : <X className="h-20 w-20 text-white ml-10" />}
    </div>
  );
};

export default CollapsibleSection;
