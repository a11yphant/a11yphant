import Instructions, { InstructionProps } from "app/components/challenge/sidebar/Instructions";
import React from "react";

interface SideBarProps {
  instructions: InstructionProps;
  hints?: Hints;
  resources?: Resources;
}

interface Hints {
  num: number;
}

type Resources = Resource[];

interface Resource {
  label: string;
  link: string;
}

const SideBar: React.FunctionComponent<SideBarProps> = ({ instructions, hints, resources }) => {
  return (
    <aside className="h-screen w-1/4 border-2 rounded-lg border-primary m-4 px-8 relative box-border">
      <button className="border-l-2 border-b-2 border-primary p-4 absolute -top-px -right-px box-border text-2xl">Back</button>
      <Instructions {...instructions} />
    </aside>
  );
};

export default SideBar;
