import Button from "app/components/buttons/Button";
import LightBulb from "app/components/icons/LightBulb";
import { Hint, HintIdFragment } from "app/generated/graphql";
import React from "react";

interface HintSectionProps {
  hints: HintIdFragment[];
  usedHints: Hint[];
  loadNextHint: () => void;
}

const HintSection: React.FunctionComponent<HintSectionProps> = ({ hints, usedHints, loadNextHint }) => {
  const totalHints = hints.length;

  const displayAvailableHints = React.useMemo(() => {
    const remainingHints = totalHints - usedHints.length;

    if (remainingHints === totalHints) {
      return `You can unlock ${totalHints} hints by clicking on the button below.`;
    } else if (remainingHints > 1) {
      return `You can unlock ${remainingHints} more hints.`;
    } else if (remainingHints === 1) {
      return `You can unlock 1 more hint.`;
    } else {
      return "There are no more hints to unlock.";
    }
  }, [totalHints, usedHints.length]);

  return (
    <div className="flex-auto overflow-y-auto mt-10 text-center px-8">
      <p>{displayAvailableHints}</p>

      {usedHints.length > 0 && (
        <ul>
          {usedHints.map((hint, idx) => (
            <li key={hint.id}>
              <h4 className="text-primary">Hint {idx + 1}</h4>
              <p>{hint.content}</p>
            </li>
          ))}
        </ul>
      )}
      {usedHints.length < totalHints && (
        <Button onClick={loadNextHint} icon={<LightBulb />}>
          {hints.length === 0 ? "show me a hint" : "show me another hint"}
        </Button>
      )}
    </div>
  );
};

export default HintSection;
