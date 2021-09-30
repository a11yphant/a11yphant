import ButtonLoading from "app/components/buttons/ButtonLoading";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import { EvaluationRouterParams } from "app/pages/challenge/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";

interface QuizLevelProps {
  question: string;
  answers: Array<{ id: string; text: string }>;
  isLastLevel: boolean;
}

const QuizLevel: React.FunctionComponent<QuizLevelProps> = ({ question, answers, isLastLevel }) => {
  const [showSubmitLoadingAnimation, setShowSubmitLoadingAnimation] = useState(false);
  const [chosenId, setChosenId] = React.useState<string>();

  const router = useRouter();
  const { challengeSlug, nthLevel }: EvaluationRouterParams = router.query;

  const submitLevel = async (): Promise<void> => {
    setShowSubmitLoadingAnimation(true);

    const nextLevel = parseInt(nthLevel as string) + 1;
    router.push(`/challenge/${challengeSlug}/level/0${nextLevel}`);
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
          {/* TODO: enable when api submission is ready */}
          {/* <CompleteEvaluationButton className="px-10 absolute right-0 bottom-0" status={ResultStatus.Success} isLastLevel={isLastLevel} /> */}
        </div>
      </section>
    </>
  );
};

export default QuizLevel;
