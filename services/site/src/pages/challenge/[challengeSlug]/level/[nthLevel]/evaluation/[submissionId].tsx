import Button from "app/components/buttons/Button";
import ButtonLoading from "app/components/buttons/ButtonLoading";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  ResultStatus,
  useChallengeBySlugQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface EvaluationRouterParams {
  challengeSlug?: string;
  nthLevel?: string;
  submissionId?: string;
}

const Evaluation: React.FunctionComponent = () => {
  // button with loading spinner
  const [loadingAnimation, setLoadingAnimation] = React.useState(false);

  const router = useRouter();
  const { challengeSlug, nthLevel, submissionId }: EvaluationRouterParams = router.query;

  const {
    data: { challenge },
  } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const submissionResult = usePollSubmissionResult({ submissionId });

  if (submissionResult === null || submissionResult.status === ResultStatus.Pending) {
    return <LoadingScreen />;
  }

  const { status, requirements, totalScore } = submissionResult;
  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  return (
    <>
      <Head>
        <title>
          Evaluation - {challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <main className="h-main p-12 flex flex-col justify-between">
        {
          <>
            <EvaluationHeader
              challengeName={challenge.name}
              levelIdx={Number(nthLevel)}
              score={totalScore}
              passed={status === ResultStatus.Success}
            />
            <div className="h-full max-w-7xl m-auto pt-20 mt-0 mb-4 flex flex-col items-left w-full box-border overflow-auto overscroll-none">
              <ul className="h-full">
                {requirements.map((requirement, idx) => {
                  const requirementTitle = `${idx + 1}. ${requirement.title}`;
                  return (
                    <EvaluationBody
                      key={requirement.id}
                      requirementTitle={requirementTitle}
                      description={requirement.description}
                      result={requirement.result}
                    />
                  );
                })}
              </ul>
            </div>
            <div className="absolute bottom-8 right-8">
              {status === ResultStatus.Fail ? (
                <ButtonLoading
                  primary
                  onClick={() => {
                    setLoadingAnimation(true);
                    router.back();
                  }}
                  className="px-10"
                  loading={loadingAnimation}
                  srTextLoading="The request is being processed."
                >
                  Retry
                </ButtonLoading>
              ) : isLastLevel ? (
                <Button
                  onClick={() => {
                    router.push("/");
                  }}
                  primary
                  className="px-10"
                >
                  Finish Challenge
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const nextLevel = parseInt(nthLevel as string) + 1;
                    router.push(`/challenge/${challengeSlug}/level/0${nextLevel}`);
                  }}
                  primary
                  className="px-10"
                >
                  Next Level
                </Button>
              )}
            </div>
          </>
        }
      </main>
    </>
  );
};

export default Evaluation;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

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
