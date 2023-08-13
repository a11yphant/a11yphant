import { ApolloError } from "@apollo/client";
import ChallengeCompletedFlashMessage from "app/components/challenge/ChallengeCompletedFlashMessage";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import {
  ChallengeBySlugDocument,
  ChallengeBySlugQuery,
  ChallengeBySlugQueryVariables,
  ResultForSubmissionDocument,
  ResultForSubmissionQuery,
  ResultForSubmissionQueryVariables,
  ResultStatus,
  useChallengeBySlugQuery,
} from "app/generated/graphql";
import { getNumFailedLevelsInARowKey } from "app/hooks/sessionState/sessionStateKeys";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
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
  const flashMessageApi = useFlashMessageApi();
  const { challengeSlug, nthLevel, submissionId }: EvaluationRouterParams = router.query;
  const [, setFailedLevelsInARow] = useSessionState<number>(getNumFailedLevelsInARowKey(challengeSlug as string, nthLevel as string), 0);

  const { data } = useChallengeBySlugQuery({ variables: { slug: challengeSlug as string } });

  const submissionResult = usePollSubmissionResult(submissionId);

  const isLastLevel = parseInt(nthLevel as string) + 1 > data?.challenge.levels.length;

  const pageTitle = `Evaluation - ${data?.challenge.name} - Level ${nthLevel}`;
  const heading = <h1 className={clsx("sr-only")}>{pageTitle}</h1>;

  React.useEffect(() => {
    if (submissionResult?.status === ResultStatus.Fail) {
      setFailedLevelsInARow((prev) => (prev ? prev + 1 : 1));
    } else if (submissionResult?.status === ResultStatus.Success) {
      setFailedLevelsInARow(0);
    }

    if (isLastLevel && submissionResult?.status === ResultStatus.Success) {
      flashMessageApi.show(<ChallengeCompletedFlashMessage />);
    }
  }, [submissionResult?.status, data?.challenge?.levels?.length]);

  return (
    <>
      <Head>
        <title>{pageTitle} | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="The a11yphant evaluation provides you with detailed feedback on our success criteria. Revisit web development topics from an accessibility perspective to make the web more inclusive."
        />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content="The a11yphant evaluation provides you with detailed feedback on our success criteria. Revisit web development topics from an accessibility perspective to make the web more inclusive."
        />
        <meta property="og:image" content="/images/SEO/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        <meta property="og:locale" content="en" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://a11yphant.com/${data?.challenge.name}/level/${nthLevel}/evaluation/${data?.challenge.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <FullScreenLayout header={<Navigation displayBreadcrumbs />}>
        {data === undefined || submissionResult === undefined || submissionResult.status === ResultStatus.Pending ? (
          <>
            <main className={clsx("h-full", "md:p-4 md:pt-0 md:flex md:flex-col md:justify-between")}>
              {heading}
              <LoadingScreen className={clsx("hidden", "lg:flex")} />
            </main>
          </>
        ) : (
          <>
            <main className={clsx("h-full max-w-screen-3xl mx-auto", "md:px-12 md:pt-12 md:pb-4 md:flex md:flex-col md:justify-between")}>
              {heading}
              {/* <SmallScreenNotification /> */}
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
                classNameBottomOverlay={"w-full h-52 shrink-0 -mt-52"}
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
      </FullScreenLayout>
    </>
  );
};

export default Evaluation;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  const { challengeSlug, submissionId } = context.params;

  try {
    const [, challenge, result] = await Promise.all([
      getServerSideCurrentUser(apolloClient),
      apolloClient.query<ChallengeBySlugQuery, ChallengeBySlugQueryVariables>({
        query: ChallengeBySlugDocument,
        variables: {
          slug: challengeSlug as string,
        },
      }),
      apolloClient.query<ResultForSubmissionQuery, ResultForSubmissionQueryVariables>({
        query: ResultForSubmissionDocument,
        variables: {
          id: submissionId as string,
        },
      }),
    ]);

    if (!result.data.resultForSubmission || !challenge.data.challenge) {
      return {
        notFound: true,
      };
    }
  } catch (e) {
    if (e instanceof ApolloError && e.graphQLErrors.find((error) => error.extensions.code === "BAD_USER_INPUT")) {
      return {
        notFound: true,
      };
    }
    throw e;
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      showScrollOverlay: false,
    },
  };
};
