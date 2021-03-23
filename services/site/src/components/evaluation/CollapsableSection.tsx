import React from "react";

import Button from "../buttons/Button";
import Check from "../icons/Check";
import Chevron from "../icons/Chevron";
import X from "../icons/X";

interface CollapsibleSectionProps {
  classes?: string;
}

const CollapsibleSection: React.FunctionComponent<CollapsibleSectionProps> = ({ classes }) => {
  const requirementPassed = false;

  return (
    <div className={`${classes} flex flex-col items-left w-full box-border h-fitContent max-w-7xl m-auto`}>
      <h3 className="text-white font-bold h2">1.0 The link can be activated using the mouse</h3>
      <div className="flex flex-row items-center w-full box-border py-6">
        <div className="flex flex-col w-full">
          <h4>
            <Button
              className="h3 flex flex-row-reverse m-0 p-0 group text-white font-bold transition duration-300 hover:text-primaryDark focus:text-primaryDark"
              overrideClassname
              aria-expanded="false"
              icon={<Chevron className="text-white mr-8 group-hover:text-primaryDark group-focus:text-primaryDark" />}
            >
              1.1 Global Requirements
            </Button>
          </h4>
          <div>
            <p className="text-white ml-16 my-4">
              The HTML code must comply to all markup rules established by the W3C. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus
              donec mattis sit accumsan, pulvinar in felis, vel arcu. Eu pellentesque purus amet, nibh eget.
            </p>
          </div>
        </div>
        {requirementPassed ? <Check className="h-24 w-24 text-white ml-10" /> : <X className="h-24 w-24 text-white ml-10" />}
      </div>
    </div>
  );
};

export default CollapsibleSection;
