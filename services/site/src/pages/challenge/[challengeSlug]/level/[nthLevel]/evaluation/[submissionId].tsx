import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import Navigation from "app/components/Navigation";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  ResultStatus,
  useChallengeBySlugQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
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
      <Navigation displayBreadcrumbs />
      {data === undefined || submissionResult === undefined || submissionResult.status === ResultStatus.Pending ? (
        <>
          <main className={clsx("h-main", "md:p-4 md:flex md:flex-col md:justify-between")}>
            <LoadingScreen className={clsx("hidden", "lg:flex")} />
          </main>
        </>
      ) : (
        <>
          <main className={clsx("h-main max-w-screen-3xl mx-auto", "md:px-12 md:pt-12 md:pb-4 md:flex md:flex-col md:justify-between")}>
            <SmallScreenNotification />
            <EvaluationHeader
              className={clsx("hidden", "lg:flex")}
              challengeName={data.challenge.name}
              levelIdx={Number(nthLevel)}
              score={submissionResult.totalScore}
              passed={submissionResult.status === ResultStatus.Success}
            />
            <ScrollOverlayWrapper
              className={clsx(
                "h-full max-w-7xl m-auto pt-20 mt-0 mb-4 hidden flex-col items-left w-full box-border overflow-auto overscroll-none",
                "lg:flex",
              )}
              classNameBottomOverlay={"w-full h-52"}
              enableTopOverlay={false}
            >
              <EvaluationBody requirements={submissionResult.requirements} />
            </ScrollOverlayWrapper>
            <div className={clsx("absolute bottom-4 right-4 hidden", "lg:block")}>
              <CompleteEvaluationButton status={submissionResult.status} isLastLevel={isLastLevel} />
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Evaluation;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  const { challengeSlug } = context.params;

  await Promise.all([
    getServerSideCurrentUser(apolloClient),
    apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
      query: ChallengeBySlugDocument,
      variables: {
        slug: challengeSlug as string,
      },
    }),
  ]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
