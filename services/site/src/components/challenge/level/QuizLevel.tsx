import LoadingButton from "app/components/buttons/LoadingButton";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import Lottie from "app/components/Lottie";
import { ResultStatus, useSubmitQuizLevelAnswerMutation } from "app/generated/graphql";
import correctAnimation from "app/lotties/correct_lottie.json";
import failAnimation from "app/lotties/fail_lottie.json";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import ChallengeCompletedFlashMessage from "../ChallengeCompletedFlashMessage";

interface QuizLevelProps {
  question: string;
  answers: Array<{ id: string; text: string }>;
  isLastLevel: boolean;
  levelId: string;
}

const QuizLevel: React.FunctionComponent<QuizLevelProps> = ({ levelId, question, answers, isLastLevel }) => {
  const [chosenId, setChosenId] = React.useState<string>(null);
  const [quizResult, setQuizResult] = React.useState<{ id: string; status: ResultStatus }>(null);
  const flashMessageApi = useFlashMessageApi();

  const [submitQuizLevelAnswerMutation, { loading }] = useSubmitQuizLevelAnswerMutation();

  const submitLevel = async (): Promise<void> => {
    const { data } = await submitQuizLevelAnswerMutation({ variables: { input: { levelId: levelId, answers: [chosenId] } } });

    setQuizResult(data.submitQuizLevelAnswer.result);
  };

  const reset = (): void => {
    setQuizResult(null);
    setChosenId(null);
  };

  React.useEffect(() => {
    reset();
  }, [levelId]);

  React.useEffect(() => {
    if (isLastLevel && quizResult?.status === ResultStatus.Success) {
      flashMessageApi.show(<ChallengeCompletedFlashMessage />);
    }
  }, [quizResult?.status, isLastLevel]);

  return (
    <>
      <section className={clsx("mx-auto h-full w-full box-border hidden", "container-dark", "lg:pt-12 lg:flex lg:flex-col lg:justify-between")}>
        <h2 className={clsx("mb-2 lg:px-12", "h4")}>Quiz</h2>
        <div className={clsx("grid grid-cols-7 lg:px-12  min-h-[50vh]")}>
          <h3
            className={clsx("mr-8 leading-tight tracking-wider font-mono col-span-4 text-5xl", "h2 prose", quizResult && "opacity-50")}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(question) }}
          />
          <div className={clsx("col-span-3 mb-8 p-1 overflow-y-auto")}>
            {quizResult === null && (
              <SingleAnswer srTitle={"Possible answers to the quiz"} answers={answers} chosenId={chosenId} onChooseId={setChosenId} />
            )}
            {quizResult?.status === ResultStatus.Fail && (
              <div>
                <p className={clsx("h2 leading-tight")}>
                  Wrong answer,<br></br> try again!
                </p>
                <Lottie
                  options={{
                    loop: false,
                    animationData: failAnimation,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  className={"h-[230px] w-[160px] mt-8"}
                  aria-hidden={true}
                />
              </div>
            )}
            {quizResult?.status === ResultStatus.Success && (
              <div>
                <p className={clsx("h2 leading-tight")}>Correct!</p>
                <Lottie
                  options={{
                    loop: false,
                    animationData: correctAnimation,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  className={"h-[240px] w-[200px] mt-8"}
                  aria-hidden={true}
                />
              </div>
            )}
          </div>
        </div>
        <div className={clsx("flex justify-end mr-12 mb-12")}>
          {quizResult === null ? (
            <LoadingButton
              primary
              onClick={submitLevel}
              loading={loading}
              submitButton
              srTextLoading="The submission is being processed."
              disabled={chosenId === null}
            >
              Submit
            </LoadingButton>
          ) : (
            <CompleteEvaluationButton status={quizResult.status} isLastLevel={isLastLevel} onRetry={reset} />
          )}
        </div>
      </section>
    </>
  );
};

export default QuizLevel;
