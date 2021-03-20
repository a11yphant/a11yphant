import CheckboxList from "app/components/challenge/sidebar/NumberedList";
import React from "react";

export interface Instructions {
  instructions: string;
  tldr: string;
  requirements: Requirement[];
}

export interface Requirement {
  id: string;
  title: string;
}

const InstructionSection: React.FunctionComponent<Instructions> = ({ instructions, tldr, requirements }) => {
  return (
    <div className="flex-auto overflow-y-auto px-8 mb-4">
      <div className="mt-10">
        {instructions.split("\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="text-primary font-bold mt-8">{tldr}</p>
      </div>
      <h3 className="text-primary font-bold mt-10 mb-8 text-center">Requirements</h3>
      <p className="mb-6">
        This level is evaluated based on the following requirements. More information on each topic can be found in the resources.
      </p>
      <div>
        <CheckboxList items={requirements} />
      </div>
    </div>
  );
};

export default InstructionSection;
