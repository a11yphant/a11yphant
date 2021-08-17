import Button from "app/components/buttons/Button";
import Chevron from "app/components/icons/Chevron";
import { Hint } from "app/generated/graphql";
import clsx from "clsx";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import sanitizeHtml from "sanitize-html";

interface HintBoxProps {
  hints: Hint[];
}

const AnimatedChevron = animated(Chevron);

const HintBox: React.FunctionComponent<HintBoxProps> = ({ hints }) => {
  const [usedHints, setUsedHints] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const totalHints = hints.length;

  // any is necessary here because the types of react-spring are somehow messed up
  const { transform }: any = useSpring({
    transform: showHint ? "rotate(0deg)" : "rotate(180deg)",
    config: {
      tension: 0,
      delay: 0,
    },
  });

  return (
    <div className={clsx("flex flex-col", "container-ultradark card-smaller")}>
      <h4 className="w-full">
        <Button
          onClick={() => {
            setShowHint((showHint) => !showHint);
            setUsedHints((usedHints) => (usedHints > 1 ? usedHints : 1));
          }}
          className={clsx(
            "w-full p-4 flex flex-row items-center justify-between group font-normal text-left transition duration-300 m-0",
            "hover:text-primaryLight",
            "focus-visible:outline-none focus:outline-none",
            "h6",
          )}
          overrideClassName
          aria-expanded={usedHints > 0}
        >
          {showHint ? "Hint" : "Stuck? Click to reveal a hint"}
          <AnimatedChevron style={{ transform: transform }} className={clsx("text-greyMiddle ml-4", "group-hover:text-primaryLight")} />
        </Button>
      </h4>
      {showHint && (
        <div className="px-4">
          <ol className="list-decimal list-inside font-normal">
            {hints.slice(0, usedHints).map((hint) => (
              <li
                key={hint.id}
                className={clsx("mt-2 mb-4 whitespace-pre-wrap", "prose")}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(hint.text) }}
              />
            ))}
          </ol>
          {usedHints < totalHints && (
            <Button
              onClick={() => {
                setUsedHints((usedHints) => (totalHints === usedHints ? usedHints : usedHints + 1));
              }}
              overrideClassName
              className={clsx(
                "font-normal border-b transition duration-300 mt-4 mb-4",
                "hover:text-primaryLight hover:border-primaryLight",
                "focus:text-primaryLight focus:border-primaryLight focus-visible-outline",
              )}
            >
              Show me another hint.
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HintBox;
