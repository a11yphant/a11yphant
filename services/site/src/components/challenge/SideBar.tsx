import Hints, { Hint } from "app/components/challenge/sidebar/Hints";
import Instructions, { Instruction } from "app/components/challenge/sidebar/Instructions";
import Resources, { Resource } from "app/components/challenge/sidebar/Resources";
import React, { useState } from "react";

interface SideBarProps {
  instructions: Instruction;
  hints?: Hint;
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
      <Instructions {...instructions} open={openSection === SectionType.instructions} setOpen={setOpenSection} />
      <Hints {...hints} open={openSection === SectionType.hints} setOpen={setOpenSection} />
      <Resources resources={resources} open={openSection === SectionType.resources} setOpen={setOpenSection} />
    </aside>
  );
};

export default SideBar;
