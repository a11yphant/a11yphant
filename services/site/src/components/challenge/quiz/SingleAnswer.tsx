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
              "px-10 py-8 mb-6 w-full rounded-lg border text-left",
              chosenId !== answer.id && "border-light",
              "transition duration-300",
              "hover:bg-primary hover:border-light hover:text-light hover:cursor-pointer",
              "focus:bg-primary focus:border-primary focus:text-light focus:outline-none",
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
