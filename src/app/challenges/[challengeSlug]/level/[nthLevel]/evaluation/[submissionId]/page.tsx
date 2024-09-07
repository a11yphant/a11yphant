import { EvaluationResult, EvaluationResultProps } from "app/components/evaluation/EvaluationResult";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import { getChallenge } from "app/lib/server-side-props/get-challenge";
import { CustomSubmissionResult, getSubmissionResult } from "app/lib/server-side-props/get-submission-result";
import clsx from "clsx";
import { Metadata } from "next";
import Head from "next/head";
import { headers } from "next/headers";
import React, { Suspense } from "react";

async function EvaluationResultLoader({
  submissionId,
  ...props
}: Omit<EvaluationResultProps, "submissionResult"> & { submissionId: string }): Promise<JSX.Element> {
  const submissionResult = await getSubmissionResult(submissionId);

  return <EvaluationResult submissionResult={submissionResult} {...props} />;
}

function EvaluationResultWithSuspense({
  submissionResult,
  submissionId,
  pageTitle,
  ...props
}: EvaluationResultProps & { submissionResult?: CustomSubmissionResult; submissionId: string; pageTitle: string }): JSX.Element {
  if (submissionResult) {
    return <EvaluationResult submissionResult={submissionResult} {...props} />;
  }

  const heading = <h1 className={clsx("sr-only")}>{pageTitle}</h1>;

  return (
    <Suspense
      fallback={
        <main className={clsx("h-full", "md:p-4 md:pt-0 md:flex md:flex-col md:justify-between")}>
          {heading}
          <LoadingScreen className={clsx("flex")} />
        </main>
      }
    >
      <main className={clsx("h-full max-w-screen-3xl mx-auto px-5", "sm:px-8", "md:px-12 md:pt-12 md:pb-4 md:flex md:flex-col md:justify-between")}>
        {heading}
        <EvaluationResultLoader submissionId={submissionId} {...props} />
      </main>
    </Suspense>
  );
}

export interface PageProps {
  params: {
    challengeSlug: string;
    nthLevel: string;
    submissionId: string;
  };
}

const Evaluation = async ({ params: { challengeSlug, nthLevel, submissionId } }: PageProps): Promise<JSX.Element> => {
  const challenge = await getChallenge(challengeSlug);

  let submissionResult: CustomSubmissionResult | undefined;
  if (headers().get("accept")?.includes("text/html")) {
    submissionResult = await getSubmissionResult(submissionId);
  }

  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  const pageTitle = `Evaluation - ${challenge.name} - Level ${nthLevel}`;

  return (
    <>
      <Head>
        <title>{pageTitle} | a11yphant</title>
      </Head>
      <FullScreenLayout header={<Navigation displayBreadcrumbs isSticky={false} />}>
        <EvaluationResultWithSuspense
          pageTitle={pageTitle}
          submissionResult={submissionResult}
          submissionId={submissionId}
          challengeSlug={challengeSlug}
          challenge={challenge}
          nthLevel={Number(nthLevel)}
          isLastLevel={isLastLevel}
        />
      </FullScreenLayout>
    </>
  );
};

export default Evaluation;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const challenge = await getChallenge(params.challengeSlug);

  return {
    title: `Evaluation - ${challenge.name} - Level ${params.nthLevel} | a11yphant`,
  };
}
