import Footer from "app/components/Footer";
import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Legend from "app/components/homepage/Legend";
import InTextLink from "app/components/links/InTextLink";
import Navigation from "app/components/Navigation";
import { ChallengesDocument, ChallengesQuery, ChallengeStatus } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";

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
        <h1 className={clsx("sr-only")} aria-label="Allyphant">
          a11yphant
        </h1>
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
