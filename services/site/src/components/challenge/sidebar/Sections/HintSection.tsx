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
  const [hints, setHints] = useState<string[]>([]);

  const loadNextHint = (): void => {
    const nextHint = allHints[hints.length];

    setHints((prevHints) => [...prevHints, nextHint]);
  };

  const displayAvailableHints = (maxHints: number, usedHints: number): String => {
    if (usedHints === 0) {
      return `You can unlock ${maxHints} hints by clicking on the button below.`;
    } else if (usedHints > 0 && usedHints !== maxHints && maxHints - usedHints !== 1) {
      return `You can unlock ${maxHints - usedHints} more hints.`;
    } else if (usedHints > 0 && maxHints - usedHints === 1) {
      return `You can unlock ${maxHints - usedHints} more hint.`;
    } else {
      return "There are no more hints to unlock.";
    }
  };

  return (
    <div className="flex-auto overflow-y-auto mt-10 text-center px-8">
      <p>{displayAvailableHints(maxHints, hints.length)}</p>

      {hints.length > 0 && (
        <ul>
          {hints.map((hint, idx) => (
            <li key={hint}>
              <h4 className="text-primary">Hint {idx + 1}</h4>
              <p>{hint}</p>
            </li>
          ))}
        </ul>
      )}
      {hints.length < maxHints && (
        <IconButton onClick={loadNextHint} text={hints.length === 0 ? "show me a hint" : "show me another hint"} icon={<LightBulb />} />
      )}
    </div>
  );
};

export default HintSection;
