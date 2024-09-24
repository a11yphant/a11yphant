import { EvaluationResult, EvaluationResultProps } from "app/components/evaluation/EvaluationResult";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import { getChallenge } from "app/lib/server-side-props/get-challenge";
import { CustomSubmissionResult, getSubmissionResult } from "app/lib/server-side-props/get-submission-result";
import clsx from "clsx";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

async function EvaluationResultLoader({
  submissionId,
  ...props
}: Omit<EvaluationResultProps, "submissionResult"> & { submissionId: string }): Promise<JSX.Element> {
  const submissionResult = await getSubmissionResult(submissionId);

  return <EvaluationResult submissionResult={submissionResult} {...props} />;
}

async function EvaluationResultWithSuspense({
  submissionResult,
  submissionId,
  ...props
}: EvaluationResultProps & { submissionResult?: CustomSubmissionResult; submissionId: string }): Promise<JSX.Element> {
  const heading = (
    <h1 className={clsx("sr-only")}>
      Evaluation - {props.challenge.name} - Level {props.nthLevel}
    </h1>
  );

  if (submissionResult) {
    return (
      <main className={clsx("h-full max-w-screen-3xl mx-auto px-5", "sm:px-8", "md:px-12 md:pt-12 md:pb-4 md:flex md:flex-col md:justify-between")}>
        {heading}
        <EvaluationResult submissionResult={submissionResult} {...props} />
      </main>
    );
  }

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
        {await EvaluationResultLoader({ submissionId, ...props })}
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

  if (!challenge) {
    notFound();
  }

  let submissionResult: CustomSubmissionResult | undefined;
  if (headers().get("accept")?.includes("text/html")) {
    submissionResult = await getSubmissionResult(submissionId);
  }

  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  return (
    <>
      <FullScreenLayout header={<Navigation displayBreadcrumbs isSticky={false} />}>
        {await EvaluationResultWithSuspense({
          challenge,
          challengeSlug,
          nthLevel: Number(nthLevel),
          submissionId,
          isLastLevel,
          submissionResult,
        })}
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
