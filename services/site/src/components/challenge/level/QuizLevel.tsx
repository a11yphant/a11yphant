import LoadingButton from "app/components/buttons/LoadingButton";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import Lottie from "app/components/Lottie";
import { ResultStatus, useSubmitQuizLevelAnswerMutation } from "app/generated/graphql";
import correctAnimation from "app/lotties/correct_lottie.json";
import failAnimation from "app/lotties/fail_lottie.json";
import clsx from "clsx";
import React from "react";
import sanitizeHtml from "sanitize-html";

import EndOfChallengeFlashMessage from "../EndOfChallengeFlashMessage";

interface QuizLevelProps {
  question: string;
  answers: Array<{ id: string; text: string }>;
  isLastLevel: boolean;
  levelId: string;
}

const QuizLevel: React.FunctionComponent<QuizLevelProps> = ({ levelId, question, answers, isLastLevel }) => {
  const [chosenId, setChosenId] = React.useState<string>(null);
  const [quizResult, setQuizResult] = React.useState<{ levelId: string; id: string; status: ResultStatus }>(null);
  const flashMessageApi = useFlashMessageApi();

  const [submitQuizLevelAnswerMutation, { loading }] = useSubmitQuizLevelAnswerMutation();

  const submitLevel = async (): Promise<void> => {
    const { data } = await submitQuizLevelAnswerMutation({ variables: { input: { levelId: levelId, answers: [chosenId] } } });

    setQuizResult({ levelId, ...data.submitQuizLevelAnswer.result });
  };

  const reset = (): void => {
    setQuizResult(null);
    setChosenId(null);
  };

  React.useEffect(() => {
    reset();
  }, [levelId]);

  React.useEffect(() => {
    if (isLastLevel && quizResult?.levelId === levelId && quizResult?.status === ResultStatus.Success) {
      flashMessageApi.show(<EndOfChallengeFlashMessage />);
    }
  }, [quizResult?.status, isLastLevel]);

  return (
    <>
      <section
        aria-labelledby="QuizHeading"
        className={clsx("mx-auto h-full w-full box-border pt-6 flex flex-col justify-between", "container-dark", "sm:pt-8", "lg:pt-12")}
      >
        <h2 id="QuizHeading" className={clsx("mb-2 px-5 sm:px-8 lg:px-12 text-grey-middle", "h5 md:h4 md:text-grey-middle")}>
          Quiz
        </h2>
        <div className={clsx("grid grid-cols-7 px-5 sm:px-8 lg:px-12 min-h-[50vh]")}>
          <h3
            className={clsx(
              "mr-4 tracking-wider font-mono col-span-7 text-2xl leading-snug",
              "xs:text-3xl sm:mr-10 sm:leading-snug",
              "md:text-4xl md:leading-snug",
              "lg:col-span-4 lg:h2 prose",
              quizResult && "opacity-50",
            )}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(question) }}
          />
          <div
            className={clsx("col-span-7 mt-6 sm:mt-10 mb-4 p-1 overflow-y-auto", "lg:col-span-3 lg:mb-8 lg:mt-0")}
            role="status"
            aria-live="assertive"
          >
            {quizResult === null && (
              <ScrollOverlayWrapper
                className={clsx("max-h-full")}
                classNameTopOverlay="h-16 -mb-16 from-background-light"
                classNameBottomOverlay="h-16 -mt-16 from-background-light"
              >
                <SingleAnswer srTitle={"Possible answers to the quiz"} answers={answers} chosenId={chosenId} onChooseId={setChosenId} />
              </ScrollOverlayWrapper>
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
            <LoadingButton primary onClick={submitLevel} loading={loading} submitButton disabled={chosenId === null}>
              Submit
            </LoadingButton>
          ) : (
            <CompleteEvaluationButton
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              status={quizResult.status}
              isLastLevel={isLastLevel}
              onRetry={reset}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default QuizLevel;
