import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

export interface SingleAnswerProps {
  className?: string;
  srTitle: string;
  answers: Array<{ id: string; text: string }>;
  chosenId?: string;
  onChooseId?: (id: string) => void;
}

const SingleAnswer: React.FunctionComponent<SingleAnswerProps> = ({ className, srTitle, answers, chosenId, onChooseId }) => {
  return (
    <RadioGroup value={chosenId} onChange={onChooseId} className={className}>
      <RadioGroup.Label className={clsx("sr-only")}>{srTitle}</RadioGroup.Label>
      {answers.map((answer, idx) => {
        return (
          <RadioGroup.Option
            key={answer.id}
            value={answer.id}
            className={clsx(
              "px-5 py-3 mb-4 w-full rounded-lg border text-left",
              "sm:px-8 sm:py-5 sm:mb-6",
              "lg:px-8 lg:py-5",
              "xl:px-10 xl:py-8",
              chosenId !== answer.id && "border-light",
              "transition duration-300",
              "hover:bg-primary hover:border-light hover:text-light hover:cursor-pointer",
              chosenId === answer.id && "bg-primary border-primary text-light",
            )}
          >
            <span className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer.text) }} />
          </RadioGroup.Option>
        );
      })}
    </RadioGroup>
  );
};

export default SingleAnswer;
