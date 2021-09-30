import ButtonLoading from "app/components/buttons/ButtonLoading";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import clsx from "clsx";
import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";

interface QuizLevelProps {
  question: string;
  answers: Array<{ id: string; text: string }>;
}

const QuizLevel: React.FunctionComponent<QuizLevelProps> = ({ question, answers }) => {
  const [showSubmitLoadingAnimation, setShowSubmitLoadingAnimation] = useState(false);
  const [chosenId, setChosenId] = React.useState<string>();

  const submitLevel = async (): Promise<void> => {
    setShowSubmitLoadingAnimation(true);
  };

  return (
    <>
      <section
        className={clsx("mx-auto h-full w-full box-border hidden", "container-dark", "lg:px-12 lg:pt-12 lg:flex lg:flex-col lg:justify-between")}
      >
        <h2 className={clsx("mb-2", "h4")}>Quiz</h2>
        <div className={clsx("grid grid-cols-7")}>
          <h3
            className={clsx("mr-8 leading-tight tracking-wider font-mono col-span-4 text-5xl", "h2 prose")}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(question) }}
          />
          <div className={clsx("col-span-3")}>
            <SingleAnswer srTitle={"Possible answers to the quiz"} answers={answers} chosenId={chosenId} onChooseId={setChosenId} />
          </div>
        </div>
        <div className="flex justify-end mr-[-3rem]">
          <ButtonLoading
            primary
            onClick={submitLevel}
            className="px-10 absolute right-0 bottom-0"
            loading={showSubmitLoadingAnimation}
            submitButton
            srTextLoading="The submission is being processed."
            disabled={chosenId === undefined}
          >
            Submit
          </ButtonLoading>
        </div>
      </section>
    </>
  );
};

export default QuizLevel;
