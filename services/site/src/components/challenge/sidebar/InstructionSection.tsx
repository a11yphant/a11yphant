import { SectionType } from "app/components/challenge/SideBar";
import CheckboxList from "app/components/challenge/sidebar/CheckboxList";
import ToggleButton from "app/components/challenge/sidebar/ToggleButton";
import React, { SetStateAction } from "react";

export interface Instructions {
  text: string[];
  tldr: string;
  requirements: Requirement[];
}

interface InstructionSectionProps extends Instructions {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

export interface Requirement {
  id: string;
  title: string;
}

const InstructionSection: React.FunctionComponent<InstructionSectionProps> = ({ text, tldr, requirements, open, setOpen }) => {
  return (
    <>
      <h3 className={`${open === true ? "disableBtn" : ""} flex items-center justify-center h-16`}>
        <ToggleButton onClick={() => setOpen(SectionType.instructions)} text="Instructions" disabled={open} />
      </h3>
      {open && (
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
      )}
    </>
  );
};

export default InstructionSection;
