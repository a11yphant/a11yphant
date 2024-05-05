import ChallengeHeader from "app/components/challengePage/ChallengeHeader";
import ChallengeList from "app/components/challengePage/ChallengeList";
import Legend from "app/components/challengePage/Legend";
import Footer from "app/components/Footer";
import InTextLink from "app/components/links/InTextLink";
import Navigation from "app/components/Navigation";
import { ChallengesDocument, ChallengesQuery, ChallengeStatus } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { Metadata } from "next";

const Challenges = async (): Promise<React.ReactElement> => {
  const client = getApolloClient();
  const {
    data: { currentUser },
  } = await getServerSideCurrentUser(client);

  const {
    data: { challenges },
  } = await client.query<ChallengesQuery>({
    query: ChallengesDocument,
  });

  const inProgressChallenges = challenges.filter((challenge) => challenge.status === ChallengeStatus.InProgress);
  const openAndFinishedChallenges = challenges.filter((challenge) => challenge.status !== ChallengeStatus.InProgress);

  return (
    <>
      <Navigation displayBreadcrumbs />
      <main>
        <div className={clsx("w-full h-full")}>
          <section
            id="challenges"
            className={clsx("max-w-screen-3xl pt-10 mx-8 mt-22 mb-4", "sm:mx-12 sm:mt-18 sm:mb-12", "md:mx-24 md:mb-24", "2xl:mx-auto")}
          >
            <ChallengeHeader className={clsx("2xl:mx-24")} userLoggedIn={currentUser?.isRegistered} />

            <Legend className={clsx("2xl:mx-24")} />
            <p className={clsx("mb-12 text-grey-middle", "2xl:mx-24")}>
              <span className="sr-only">Disclaimer:</span>
              <span aria-hidden="true" className="text-xl text-grey-middle">
                *
              </span>{" "}
              Currently, we only offer easy challenges. However, our small team is dedicated to producing more content for you. We will announce new
              challenges on our{" "}
              <InTextLink
                href="https://twitter.com/a11yphant"
                opensInNewTab
                overrideClassName
                className="text-grey-middle font-sans font-normal border-grey-middle
        transition-colors duration-300
        hover:text-primary-light hover:border-transparent
        focus-rounded-instead-of-underline"
              >
                Twitter account
              </InTextLink>
              . <br />
            </p>

            {inProgressChallenges.length > 0 && (
              <ChallengeList
                className={clsx("2xl:mx-24")}
                heading={"Continue where you left"}
                challenges={inProgressChallenges}
                displayCompleted={false}
              />
            )}

            {openAndFinishedChallenges.length > 0 && (
              <ChallengeList
                className={clsx("2xl:mx-24")}
                heading={inProgressChallenges.length === 0 ? "All challenges" : "Other challenges"}
                challenges={openAndFinishedChallenges}
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Challenges;

export const metadata: Metadata = {
  title: "Challenges | a11yphant",
  description:
    "Web accessibility topics are split up into short challenges. Solve coding levels and single-choice quizzes, with each level teaching you one thing at a time.",
  openGraph: {
    url: "https://a11yphant.com/challenges",
    title: "Challenges | a11yphant",
    description:
      "Web accessibility topics are split up into short challenges. Solve coding levels and single-choice quizzes, with each level teaching you one thing at a time.",
    images: [
      {
        url: "https://a11yphant.com/images/SEO/mockups-social-media.jpg",
        alt: "A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written.",
      },
    ],
  },
  twitter: {
    title: "Challenges | a11yphant",
    description:
      "Web accessibility topics are split up into short challenges. Solve coding levels and single-choice quizzes, with each level teaching you one thing at a time.",
    images: [{ url: "https://a11yphant.com/images/SEO/mockups-social-media.jpg" }],
  },
};
