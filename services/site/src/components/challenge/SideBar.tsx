import HintSection, { Hints } from "app/components/challenge/sidebar/HintSection";
import InstructionSection, { Instructions } from "app/components/challenge/sidebar/InstructionSection";
import ResourceSection, { Resource } from "app/components/challenge/sidebar/ResourceSection";
import React, { useState } from "react";

interface SideBarProps {
  instructions: Instructions;
  hints?: Hints;
  resources?: Resource[];
}

export enum SectionType {
  instructions = "instructions",
  hints = "hints",
  resources = "resources",
}

const SideBar: React.FunctionComponent<SideBarProps> = ({ instructions, hints, resources }) => {
  const [openSection, setOpenSection] = useState<SectionType>(SectionType.instructions);

  return (
    <aside className="h-screen w-1/4 border-2 rounded-lg border-primary m-4 px-8 relative box-border">
      <button className="border-l-2 border-b-2 border-primary p-4 h-16 absolute -top-px -right-px box-border text-2xl">Back</button>
      <InstructionSection {...instructions} open={openSection === SectionType.instructions} setOpen={setOpenSection} />
      <HintSection {...hints} open={openSection === SectionType.hints} setOpen={setOpenSection} />
      <ResourceSection resources={resources} open={openSection === SectionType.resources} setOpen={setOpenSection} />
    </aside>
  );
};

export default SideBar;
