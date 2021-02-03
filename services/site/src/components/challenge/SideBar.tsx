import HintSection, { Hints } from "app/components/challenge/sidebar/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/ResourceSection";
import React, { useState } from "react";

interface SideBarProps {
  classes: string;
  instructions: Instructions;
  hints: Hints;
  resources: Resource[];
}

export enum SectionType {
  instructions = "instructions",
  hints = "hints",
  resources = "resources",
}

const SideBar: React.FunctionComponent<SideBarProps> = ({ classes, instructions, hints, resources }) => {
  const [openSection, setOpenSection] = useState<SectionType>(SectionType.instructions);

  return (
    <aside className={`${classes} flex flex-col border-2 rounded-lg border-primary relative box-border`}>
      <button className="border-l-2 border-b-2 border-primary p-4 h-16 absolute -top-px -right-px box-border text-2xl">{"<"}</button>
      <div className="flex h-full flex-col justify-around">
        <div className="border-b-2 border-primary flex-auto w-full items-center justify-center flex">
          <span className="text-primary transform -rotate-90 text-xl">Instructions</span>
        </div>
        <div className="border-b-2 border-primary flex-auto w-full items-center justify-center flex">
          <span className="text-primary transform -rotate-90 text-xl">Hints</span>
        </div>
        <div className="border-b-2 border-primary flex-auto w-full items-center justify-center flex">
          <span className="text-primary transform -rotate-90 text-xl">Resources</span>
        </div>
      </div>
      <div>
        <InstructionSection {...instructions} open={openSection === SectionType.instructions} setOpen={setOpenSection} />
        <HintSection {...hints} open={openSection === SectionType.hints} setOpen={setOpenSection} />
        <ResourceSection resources={resources} open={openSection === SectionType.resources} setOpen={setOpenSection} />
      </div>
    </aside>
  );
};

export default SideBar;
