import CheckboxList from "app/components/challenge/sidebar/CheckboxList";
import React from "react";

export interface Instructions {
  text: string[];
  tldr: string;
  requirements: Requirement[];
}

export interface Requirement {
  id: string;
  title: string;
}

const InstructionSection: React.FunctionComponent<Instructions> = ({ text, tldr, requirements }) => {
  return (
    <div className="flex-auto overflow-y-auto px-8 mb-4">
      <div className="mt-10">
        {text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="text-primary font-bold mt-8">{tldr}</p>
      </div>
      <h3 className="text-primary font-bold mt-10 mb-8 text-center">Requirements</h3>
      <div>
        <CheckboxList items={requirements} />
      </div>
    </div>
  );
};

export default InstructionSection;
