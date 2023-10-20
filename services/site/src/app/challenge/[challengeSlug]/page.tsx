import Footer from "app/components/Footer";
import Check from "app/components/icons/Check";
import Navigation from "app/components/Navigation";
import { ChallengeDetailsBySlugDocument, ChallengeDetailsBySlugQuery, LevelStatus } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import clsx from "clsx";
import Link from "next/link";
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

          <ul className="gap-4 pt-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {challenge.levels.map((level) => {
              const isFirstUnfinishedLevel = level.id === firstUnfinishedLevel?.id;
              return (
                <li className="m-0 p-0" key={level.id}>
                  <Link
                    href={`/challenge/${challengeSlug}/level/${String(level.order).padStart(2, "0")}`}
                    className={clsx(
                      "relative block border border-solid rounded-lg px-4 py-3 w-full h-18",
                      "hover:bg-primary-dark hover:border-primary-dark",
                      !isFirstUnfinishedLevel && "border-grey-dark",
                      isFirstUnfinishedLevel && "border-primary bg-primary",
                    )}
                  >
                    <span className="h3 text-base text-grey block">Level {String(level.order).padStart(2, "0")}</span>
                    <span className="font-normal text-grey-middle mb-0 block">{level.__typename === "QuizLevel" ? "Quiz" : "Coding"}</span>
                    {level.status === LevelStatus.Finished && <Check className="h-7 w-10 absolute top-4 right-5 text-light" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Challenge;
