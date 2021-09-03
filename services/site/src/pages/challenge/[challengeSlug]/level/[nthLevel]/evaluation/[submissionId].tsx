import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
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
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

export interface EvaluationRouterParams {
  challengeSlug?: string;
  nthLevel?: string;
  submissionId?: string;
}

const Evaluation: React.FunctionComponent = () => {
  const router = useRouter();
  const { challengeSlug, nthLevel, submissionId }: EvaluationRouterParams = router.query;

  const { data } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const submissionResult = usePollSubmissionResult(submissionId);

  if (data === undefined || submissionResult === undefined || submissionResult.status === ResultStatus.Pending) {
    return <LoadingScreen className="hidden md:flex" />;
  }
  const { challenge } = data;

  const { status, requirements, totalScore } = submissionResult;
  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  return (
    <>
      <Head>
        <title>
          Evaluation - {challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <main className={clsx("h-main", "md:p-12 md:flex md:flex-col md:justify-between")}>
        <SmallScreenNotification />
        <EvaluationHeader
          className="hidden md:flex"
          challengeName={challenge.name}
          levelIdx={Number(nthLevel)}
          score={totalScore}
          passed={status === ResultStatus.Success}
        />
        <div
          className={clsx(
            "h-full max-w-7xl m-auto pt-20 mt-0 mb-4 hidden flex-col items-left w-full box-border overflow-auto overscroll-none",
            "md:flex",
          )}
        >
          <EvaluationBody requirements={requirements} />
        </div>
        <div className={clsx("absolute bottom-8 right-8 hidden", "md:block")}>
          <CompleteEvaluationButton status={status} isLastLevel={isLastLevel} />
        </div>
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
