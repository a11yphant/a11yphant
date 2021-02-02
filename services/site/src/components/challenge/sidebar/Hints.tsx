import { SectionType } from "app/components/challenge/SideBar";
import React, { SetStateAction } from "react";

export interface Hint {
  num: number;
}

interface HintProps extends Hint {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

const Hints: React.FunctionComponent<HintProps> = ({ num, open, setOpen }) => {
  return (
    <div>
      <h3
        onClick={() => setOpen(SectionType.hints)}
        className="flex text-primary font-bold items-center justify-center h-16 border-t-2 border-primary"
      >
        Hints
      </h3>
      {open && (
        <div className="sidebar__content mt-10 text-center">
          <p>You can unlock hints by clicking on the button below.</p>
          <button className="border-2 rounded-lg border-primary p-4">show me a hint</button>
        </div>
      )}
    </div>
  );
};

export default Hints;
