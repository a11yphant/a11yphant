import Footer from "app/components/Footer";
import { ChallengeModalLevelCard } from "app/components/homepage/challengeModal/ChallengeModalLevelCard";
import Navigation from "app/components/Navigation";
import { ChallengeDetailsBySlugDocument, ChallengeDetailsBySlugQuery, LevelStatus } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import clsx from "clsx";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

type PageProps = {
  params: {
    challengeSlug: string;
  };
};

const Challenge = async ({ params: { challengeSlug } }: PageProps): Promise<React.ReactElement> => {
  const client = getApolloClient();
  const response = await client.query<ChallengeDetailsBySlugQuery>({
    query: ChallengeDetailsBySlugDocument,
    variables: {
      slug: challengeSlug,
    },
  });

  const challenge = response.data.challenge;

  if (!challenge) {
    notFound();
  }

  const firstUnfinishedLevel =
    challenge === undefined
      ? undefined
      : challenge.levels.find((level) => level.status === LevelStatus.Open || level.status === LevelStatus.InProgress);

  return (
    <>
      <Navigation displayBreadcrumbs />
      <main className="h-full box-border max-w-screen-3xl mx-auto">
        <div className="mx-8 py-8 h-main max-w-screen-3xl sm:mx-12 lg:mt-12 lg:mx-24">
          <h1 className="mb-8 h2 md:h1">{challenge?.name}</h1>
          <p className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(challenge.introduction) }} />

          <div className={clsx("gap-4 pt-8", "grid grid-cols-1 gap-y-4", "xs:grid-cols-2", "lg:grid-cols-3", "2xl:grid-cols-4")}>
            {challenge.levels.map((level) => {
              return (
                <ChallengeModalLevelCard
                  key={level.id}
                  challengeSlug={challengeSlug}
                  levelNumber={level.order}
                  status={level.status}
                  type={level.__typename || ""}
                  isFirstUnfinishedLevel={level.id === firstUnfinishedLevel?.id}
                />
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Challenge;
