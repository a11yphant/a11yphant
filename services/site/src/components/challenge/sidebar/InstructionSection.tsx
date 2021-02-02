import { SectionType } from "app/components/challenge/SideBar";
import React, { SetStateAction } from "react";

export interface Instructions {
  text: string[];
  tldr: string;
  requirements: string[];
}

interface InstructionSectionProps extends Instructions {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

const InstructionSection: React.FunctionComponent<InstructionSectionProps> = ({ text, tldr, requirements, open, setOpen }) => {
  return (
    <div>
      <h3 onClick={() => setOpen(SectionType.instructions)} className="flex text-primary font-bold items-center justify-center h-16">
        Instructions
      </h3>
      {open && (
        <div className="sidebar__content">
          <div className="mt-10">
            {text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-primary font-bold mt-8">{tldr}</p>
          </div>
          <h3 className="text-primary font-bold mt-10 mb-8 text-center">Requirements</h3>
          <div>
            <ul>
              {requirements.map((requirement) => (
                <li key={requirement} className="text-primary my-2">
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionSection;
