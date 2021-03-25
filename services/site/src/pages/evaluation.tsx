import Button from "app/components/buttons/Button";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import Navigation from "app/components/Navigation";
import {
  ResultForSubmissionDocument,
  ResultForSubmissionQueryResult,
  ResultForSubmissionQueryVariables,
  ResultStatus,
  useResultForSubmissionLazyQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import React, { useState } from "react";

// TODO: replace with API data
const submissionId = "3fc86d0e-28de-4b68-b26d-021bf28a50cb";

const Evaluation: React.FunctionComponent = () => {
  // state
  const [queryInterval, setQueryInterval] = useState<NodeJS.Timeout | undefined>();

  // query data with lazy query
  const [getResultForSubmission, { data }] = useResultForSubmissionLazyQuery({ fetchPolicy: "network-only" });
  const status = data?.resultForSubmission?.status;
  const failedChecks = data?.resultForSubmission?.numberOfFailedChecks;
  const totalChecks = data?.resultForSubmission?.numberOfChecks;
  const requirements = data?.resultForSubmission?.requirements || [];

  // fetch every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      getResultForSubmission({ variables: { id: submissionId } });
    }, 3000);

    setQueryInterval(interval);
  }, []);

  // stop fetch when status is not PENDING anymore
  React.useEffect(() => {
    if (status && status !== ResultStatus.Pending) {
      clearInterval(queryInterval);
    }
  }, [status, queryInterval]);

  // level is completed when all checks passed
  let levelCompleted = false;
  if (failedChecks && failedChecks == 0) {
    levelCompleted = true;
  }

  // total score in %
  const score = 100 - (failedChecks / totalChecks) * 100;
  const totalScore = parseInt(score.toFixed(2));

  // render requirements
  const getRequirements = requirements.map((requirement, idx) => {
    const requirementTitle = `${idx + 1}. ${requirement.title}`;
    return <EvaluationBody key={requirement.id} requirementTitle={requirementTitle} checks={requirement.checks} requirementIdx={idx + 1} />;
  });

  return (
    <div className="w-screen h-screen">
      <Navigation challengeName="Accessible Links" currentLevel="01" maxLevel="03" />
      <main className="flex flex-col justify-between h-18/20 box-border p-8 bg-primary m-4 rounded-lg">
        <EvaluationHeader challengeName="Accessible Links" levelIdx="01" score={totalScore}></EvaluationHeader>
        {!status || status === ResultStatus.Pending ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="flex flex-col items-left w-full box-border h-full max-w-7xl m-auto pt-24 mt-0 mb-4 overflow-scroll">
              {getRequirements}
            </div>
            <div className="absolute bottom-8 right-8">
              <Button
                onClick={() => {
                  alert("Thank you Mario, but our princess is in another castle!");
                }}
                className="bg-white text-primary px-10"
              >
                {levelCompleted ? "Next Level" : "Retry"}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Evaluation;

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query<ResultForSubmissionQueryResult, ResultForSubmissionQueryVariables>({
    query: ResultForSubmissionDocument,
    variables: {
      id: submissionId,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
