import Button from "app/components/buttons/Button";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  ResultStatus,
  useChallengeBySlugQuery,
  useResultForSubmissionLazyQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { useChallenge } from "app/lib/ChallengeContext";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Evaluation: React.FunctionComponent = () => {
  const challengeContext = useChallenge();
  const router = useRouter();
  const { challengeSlug, nthLevel } = router.query;

  const {
    data: { challenge },
  } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  // state
  const [queryInterval, setQueryInterval] = useState<NodeJS.Timeout | undefined>();
  const [totalScore, setTotalScore] = useState<number>(0);

  // query data with lazy query
  const [getResultForSubmission, { data }] = useResultForSubmissionLazyQuery({ fetchPolicy: "network-only" });
  const status = data?.resultForSubmission?.status;
  const failedChecks = data?.resultForSubmission?.numberOfFailedRequirementChecks;
  const totalChecks = data?.resultForSubmission?.numberOfCheckedRequirements;
  const requirements = data?.resultForSubmission?.requirements || [];

  // fetch every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      getResultForSubmission({ variables: { id: challengeContext.submissionId } });
    }, 3000);

    setQueryInterval(interval);
  }, []);

  // stop fetch when status is not PENDING anymore
  React.useEffect(() => {
    if (status && status !== ResultStatus.Pending) {
      clearInterval(queryInterval);
    }
  }, [status, queryInterval]);

  React.useEffect(() => {
    if (failedChecks !== undefined && totalChecks !== undefined) {
      setTotalScore(100 - (failedChecks / totalChecks) * 100);
    }
  }, [failedChecks, totalChecks]);

  // // level is completed when all checks passed
  let failedLevel = true;
  if (Number.isInteger(failedChecks) && failedChecks === 0) {
    failedLevel = false;
  }

  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  // render requirements
  const getRequirements = React.useMemo(
    () =>
      requirements.map((requirement, idx) => {
        const requirementTitle = `${idx + 1}. ${requirement.title}`;
        return (
          <EvaluationBody
            key={requirement.id}
            requirementTitle={requirementTitle}
            description={requirement.description}
            result={requirement.result}
          />
        );
      }),
    [requirements],
  );

  return (
    <>
      <Head>
        <title>
          Evaluation - {challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <main className="flex flex-col justify-between h-main box-border p-8 bg-primary m-4 rounded-lg">
        <EvaluationHeader
          challengeName={challenge.name}
          levelIdx={nthLevel as string}
          score={totalScore}
          showScore={status === ResultStatus.Success || status === ResultStatus.Fail}
        />
        {!status || status === ResultStatus.Pending ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="flex flex-col items-left w-full box-border h-full max-w-7xl m-auto pt-24 mt-0 mb-4 overflow-scroll">
              {getRequirements}
            </div>
            <div className="absolute bottom-8 right-8">
              {failedLevel ? (
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  className="bg-white text-primary px-10"
                >
                  Retry
                </Button>
              ) : isLastLevel ? (
                <Button
                  onClick={() => {
                    router.push("/");
                  }}
                  className="bg-white text-primary px-10"
                >
                  To Homescreen
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const nextLevel = parseInt(nthLevel as string) + 1;
                    router.push(`/challenge/${challengeSlug}/level/0${nextLevel}`);
                  }}
                  className="bg-white text-primary px-10"
                >
                  Next Level
                </Button>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Evaluation;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();

  const { challengeSlug } = context.params;

  await apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
    query: ChallengeBySlugDocument,
    variables: {
      slug: challengeSlug as string,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
