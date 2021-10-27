import ButtonLoading from "app/components/buttons/ButtonLoading";
import SingleAnswer from "app/components/challenge/quiz/SingleAnswer";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import { ResultStatus, useSubmitQuizLevelAnswerMutation } from "app/generated/graphql";
import correctAnimation from "app/lotties/correct_lottie.json";
import failAnimation from "app/lotties/fail_lottie.json";
import clsx from "clsx";
import React from "react";
import Lottie from "react-lottie";
import sanitizeHtml from "sanitize-html";
interface QuizLevelProps {
  question: string;
  answers: Array<{ id: string; text: string }>;
  isLastLevel: boolean;
  levelId: string;
}

const QuizLevel: React.FunctionComponent<QuizLevelProps> = ({ levelId, question, answers, isLastLevel }) => {
  const [chosenId, setChosenId] = React.useState<string>();
  const [quizResult, setQuizResult] = React.useState<{ id: string; status: ResultStatus }>();

  const [submitQuizLevelAnswerMutation, { loading }] = useSubmitQuizLevelAnswerMutation();

  const submitLevel = async (): Promise<void> => {
    const { data } = await submitQuizLevelAnswerMutation({ variables: { input: { levelId: levelId, answers: [chosenId] } } });

    setQuizResult(data.submitQuizLevelAnswer.result);
  };

  const reset = (): void => {
    setQuizResult(undefined);
    setChosenId(undefined);
  };

  React.useEffect(() => {
    reset();
  }, [levelId]);

  return (
    <>
      <section
        className={clsx("mx-auto h-full w-full box-border hidden", "container-dark", "lg:px-12 lg:pt-12 lg:flex lg:flex-col lg:justify-between")}
      >
        <h2 className={clsx("mb-2", "h4")}>Quiz</h2>
        <div className={clsx("grid grid-cols-7 min-h-[50vh]")}>
          <h3
            className={clsx("mr-8 leading-tight tracking-wider font-mono col-span-4 text-5xl", "h2 prose", quizResult && "opacity-50")}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(question) }}
          />
          <div className={clsx("col-span-3 mb-8 overflow-y-auto")}>
            {quizResult === undefined && (
              <SingleAnswer srTitle={"Possible answers to the quiz"} answers={answers} chosenId={chosenId} onChooseId={setChosenId} />
            )}
            {quizResult?.status === ResultStatus.Fail && (
              <div>
                <p className="h2 leading-tight">
                  Wrong answer,<br></br> try again!
                </p>
                <Lottie
                  options={{
                    loop: false,
                    autoplay: true,
                    animationData: failAnimation,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={230}
                  width={160}
                  ariaRole={"img"}
                  title={"A cross"}
                  style={{ margin: "2rem 0 0" }}
                />
              </div>
            )}
            {quizResult?.status === ResultStatus.Success && (
              <div>
                <p className="h2 leading-tight">Correct!</p>
                <Lottie
                  options={{
                    loop: false,
                    autoplay: true,
                    animationData: correctAnimation,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={240}
                  width={200}
                  ariaRole={"img"}
                  title={"A check mark"}
                  style={{ margin: "2rem 0 0" }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mr-[-3rem]">
          {quizResult === undefined ? (
            <ButtonLoading
              primary
              onClick={submitLevel}
              className="px-10 absolute right-0 bottom-0"
              loading={loading}
              submitButton
              srTextLoading="The submission is being processed."
              disabled={chosenId === undefined}
            >
              Submit
            </ButtonLoading>
          ) : (
            <CompleteEvaluationButton
              className="px-10 absolute right-0 bottom-0"
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
