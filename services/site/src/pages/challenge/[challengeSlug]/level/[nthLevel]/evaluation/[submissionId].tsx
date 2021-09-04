import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
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

  const isLastLevel = parseInt(nthLevel as string) + 1 > data?.challenge.levels.length;

  return (
    <>
      <Head>
        <title>
          Evaluation - {data?.challenge.name} - Level {nthLevel}
        </title>
      </Head>
      <main className={clsx("h-main", "md:p-12 md:flex md:flex-col md:justify-between")}>
        {data === undefined || submissionResult === undefined || submissionResult.status === ResultStatus.Pending ? (
          <LoadingScreen className="hidden md:flex" />
        ) : (
          <>
            <SmallScreenNotification />
            <EvaluationHeader
              className="hidden md:flex"
              challengeName={data.challenge.name}
              levelIdx={Number(nthLevel)}
              score={submissionResult.totalScore}
              passed={submissionResult.status === ResultStatus.Success}
            />
            <ScrollOverlayWrapper
              className={clsx(
                "h-full max-w-7xl m-auto pt-20 mt-0 mb-4 hidden flex-col items-left w-full box-border overflow-auto overscroll-none",
                "md:flex",
              )}
              classNameBottomOverlay={"w-full h-52"}
              enableTopOverlay={false}
            >
              <EvaluationBody requirements={submissionResult.requirements} />
            </ScrollOverlayWrapper>
            <div className={clsx("absolute bottom-8 right-8 hidden", "md:block")}>
              <CompleteEvaluationButton status={submissionResult.status} isLastLevel={isLastLevel} />
            </div>
          </>
        )}
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
