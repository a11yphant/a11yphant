import { isCodeLevel, isQuizLevel } from "app/components/challenge/helpers";
import CodeLevel from "app/components/challenge/level/CodeLevel";
import QuizLevel from "app/components/challenge/level/QuizLevel";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import { getChallenge } from "app/lib/server-side-props/get-challenge";
import { getLevel } from "app/lib/server-side-props/get-level";
import clsx from "clsx";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

type PageProps = {
  params: {
    challengeSlug: string;
    nthLevel: string;
  };
};

const Level = async ({ params: { challengeSlug, nthLevel } }: PageProps): Promise<React.ReactElement> => {
  const challenge = await getChallenge(challengeSlug);

  if (!challenge) {
    notFound();
  }

  const level = await getLevel(nthLevel, challengeSlug);

  if (!level) {
    notFound();
  }

  const isLastLevel = parseInt(nthLevel as string) + 1 > challenge.levels.length;

  const header = <Navigation displayBreadcrumbs isSticky={false} />;

  return (
    <FullScreenLayout header={header}>
      <main className={clsx("max-h-full h-full px-4 pb-4 flex flex-col md:flex-row justify-between box-border")}>
        <h1 className={clsx("sr-only")}>{`${challenge.name} - Level ${nthLevel}`}</h1>
        {isCodeLevel(level) && <CodeLevel challengeName={challenge.name} level={level} />}
        {isQuizLevel(level) && <QuizLevel question={level.question} answers={level.answerOptions} isLastLevel={isLastLevel} levelId={level.id} />}
      </main>
    </FullScreenLayout>
  );
};

export default Level;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const challenge = await getChallenge(params.challengeSlug);

  return {
    title: `Challenge: ${challenge.name} - Level ${params.nthLevel} | a11yphant`,
    description:
      "Solve coding levels and single-choice quizzes about web accessibility on a11yphant, broken down into manageable pieces. Start your accessibility journey today!",
    authors: [{ name: "a11yphant", url: "https://a11yphant.com" }],
    openGraph: {
      url: `https://a11yphant.com/challenge/${challenge.name.replace(/ /g, "-").replace(/\./g, "").toLowerCase()}/level/${params.nthLevel}`,
      type: "website",
      locale: "en",
      images: [
        {
          url: "https://a11yphant.com/images/SEO/mockups-CHALLENGES.jpg",
          alt: "A screenshot showing all available challenges on a11yphant and their difficulty.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@a11yphant",
      images: [{ url: "https://a11yphant.com/images/SEO/mockups-CHALLENGES.jpg" }],
    },
  };
}
