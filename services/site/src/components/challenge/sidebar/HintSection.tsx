import IconButton from "app/components/buttons/IconButton";
import { SectionType } from "app/components/challenge/SideBar";
import ToggleButton from "app/components/challenge/sidebar/ToggleButton";
import ArrowRight from "app/components/icons/ArrowRight";
import React, { SetStateAction, useState } from "react";

export interface Hints {
  num: number;
}

interface HintSectionProps extends Hints {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<SectionType>>;
}

// @Todo: replace with api
const allHints = [
  "The browser has a native way of handling hyperlinks. You don’t need any JavaScript for that.",
  "The span element is certainly not the right choice here.",
  "You should try using the anchor element (<a>) for solving this task.",
];

const HintSection: React.FunctionComponent<HintSectionProps> = ({ num: maxHints, open, setOpen }) => {
  const [usedHints, setUsedHints] = useState<number>(0);
  const [hints, setHints] = useState<string[]>([]);

  const loadNextHint = () => {
    const nextHint = allHints[usedHints];

    setHints((prevHints) => [...prevHints, nextHint]);
    setUsedHints((prevUsedHints) => ++prevUsedHints);
  };

  return (
    <>
      <h3 className={`${open === true ? "disableBtn" : ""} flex items-center justify-center h-16 border-t-2 border-primary`}>
        <ToggleButton onClick={() => setOpen(SectionType.hints)} text="Hints" disabled={open} />
      </h3>
      {open && (
        <div className="flex-auto overflow-y-auto mt-10 text-center px-8">
          {hints.length === 0 && <p>You can unlock hints by clicking on the button below.</p>}
          {hints.length > 0 && (
            <ul>
              {hints.map((hint, idx) => (
                <li>
                  <h4 className="text-primary">Hint {idx + 1}</h4>
                  <p>{hint}</p>
                </li>
              ))}
            </ul>
          )}
          {usedHints < maxHints && (
            <IconButton onClick={loadNextHint} text={usedHints === 0 ? "show me a hint" : "show me another hint"} icon={<ArrowRight />} />
          )}
        </div>
      )}
    </>
  );
};

export default HintSection;
