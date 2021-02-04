import IconButton from "app/components/buttons/IconButton";
import LightBulb from "app/components/icons/LightBulb";
import React, { useState } from "react";

export interface Hints {
  num: number;
}

// @Todo: replace with api
const allHints = [
  "The browser has a native way of handling hyperlinks. You don’t need any JavaScript for that.",
  "The span element is certainly not the right choice here.",
  "You should try using the anchor element (<a>) for solving this task.",
];

const HintSection: React.FunctionComponent<Hints> = ({ num: maxHints }) => {
  const [usedHints, setUsedHints] = useState<number>(0);
  const [hints, setHints] = useState<string[]>([]);

  const loadNextHint = () => {
    const nextHint = allHints[usedHints];

    setHints((prevHints) => [...prevHints, nextHint]);
    setUsedHints((prevUsedHints) => ++prevUsedHints);
  };

  return (
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
        <IconButton onClick={loadNextHint} text={usedHints === 0 ? "show me a hint" : "show me another hint"} icon={<LightBulb />} />
      )}
    </div>
  );
};

export default HintSection;
