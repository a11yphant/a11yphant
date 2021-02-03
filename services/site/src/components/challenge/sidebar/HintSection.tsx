import IconButton from "app/components/buttons/IconButton";
import ToggleButton from "app/components/buttons/ToggleButton";
import { SectionType } from "app/components/challenge/SideBar";
import React, { SetStateAction } from "react";

export interface Hints {
  num: number;
}

interface HintSectionProps extends Hints {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

const HintSection: React.FunctionComponent<HintSectionProps> = ({ num, open, setOpen }) => {
  return (
    <>
      <h3 className={`${open === true ? "disableBtn" : ""} flex items-center justify-center h-16 border-t-2 border-primary`}>
        <ToggleButton onClick={() => setOpen(SectionType.hints)} text="Hints" disabled={open} />
      </h3>
      {open && (
        <div className="flex-auto overflow-y-auto mt-10 text-center px-8">
          <p>You can unlock hints by clicking on the button below.</p>
          <IconButton onClick={() => setOpen(SectionType.hints)} text="show me a hint" />
        </div>
      )}
    </>
  );
};

export default HintSection;
