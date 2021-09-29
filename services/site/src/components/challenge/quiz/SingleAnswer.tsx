import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

interface SingleAnswerProps {
  className?: string;
  srTitle: string;
  answers: Array<{ id: string; text: string }>;
}

const SingleAnswer: React.FunctionComponent<SingleAnswerProps> = ({ className, srTitle, answers }) => {
  const [chosenId, setChosenId] = React.useState<string>();

  return (
    <RadioGroup value={chosenId} onChange={setChosenId} className={className}>
      <RadioGroup.Label className="sr-only">{srTitle}</RadioGroup.Label>
      {answers.map((answer, idx) => {
        return (
          <RadioGroup.Option
            key={answer.id}
            value={answer.id}
            className={clsx(
              "px-10 py-8 mb-6 w-full rounded-lg border text-left",
              chosenId !== answer.id && "border-light",
              "transition duration-300",
              "hover:bg-primary hover:border-primary hover:text-light hover:cursor-pointer",
              "focus:bg-primary focus:border-primary focus:text-light focus:outline-none",
              chosenId === answer.id && "bg-primary border-primary text-light",
            )}
          >
            <span>{answer.text}</span>
          </RadioGroup.Option>
        );
      })}
    </RadioGroup>
  );
};

export default SingleAnswer;
