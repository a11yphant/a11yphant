import Button from "app/components/buttons/Button";
import Chevron from "app/components/icons/Chevron";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

import { Hint } from "../../Sidebar";

interface HintBoxProps {
  hints: Hint[];
}

const HintBox: React.FunctionComponent<HintBoxProps> = ({ hints }) => {
  const [usedHints, setUsedHints] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const totalHints = hints.length;

  // const displayAvailableHints = React.useMemo(() => {
  //   const remainingHints = totalHints - usedHints;

  //   if (remainingHints === totalHints) {
  //     return (
  //       <>
  //         There are <b>{totalHints}</b> hints to help you with this level.
  //       </>
  //     );
  //   } else if (remainingHints > 1) {
  //     return `You can unlock ${remainingHints} more hints.`;
  //   } else if (remainingHints === 1) {
  //     return `You can unlock 1 more hint.`;
  //   } else {
  //     return "There are no more hints to unlock.";
  //   }
  // }, [totalHints, usedHints.length]);

  const AnimatedChevron = animated(Chevron);

  // any is necessary here because the types of react-spring are somehow messed up
  const { transform }: any = useSpring({
    transform: showHint ? "rotate(180deg)" : "rotate(0deg)",
    config: {
      tension: 0,
      delay: 0,
    },
  });

  return (
    <div className={`flex flex-row items-start w-full box-border py-2`}>
      <h4>
        <Button
          onClick={() => {
            setShowHint((showHint) => !showHint);
            setUsedHints((usedHints) => (usedHints > 1 ? usedHints : 1));
          }}
          className="h3 flex flex-row-reverse m-0 py-4 pr-4 group text-white font-bold transition duration-300 hover:text-primaryDark focus:text-primaryDark"
          overrideClassname
          aria-expanded={usedHints > 0}
          icon={
            <AnimatedChevron style={{ transform: transform }} className="text-white mr-8 group-hover:text-primaryDark group-focus:text-primaryDark" />
          }
        >
          {showHint ? "Hint" : "Stuck? Click to reveal a hint"}
        </Button>
      </h4>
      <div hidden={!(usedHints > 0)}>
        <ol className="text-white ml-16 my-4">
          {hints.slice(0, usedHints).map((hint) => (
            <li>{hint.title}</li>
          ))}
        </ol>
        {usedHints < totalHints && (
          <Button
            onClick={() => {
              setUsedHints((usedHints) => (totalHints === usedHints ? usedHints : usedHints + 1));
            }}
          >
            Show me another hint.
          </Button>
        )}
      </div>
    </div>
  );
};

export default HintBox;
