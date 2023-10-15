import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessageEnum, getFlashMessage } from "app/components/common/flashMessage/messages/getFlashMessage";
import Footer from "app/components/Footer";
import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import ChallengeList from "app/components/homepage/ChallengeList";
import Hero from "app/components/homepage/Hero";
import Legend from "app/components/homepage/Legend";
import InTextLink from "app/components/links/InTextLink";
import Navigation from "app/components/Navigation";
import { ChallengeDifficulty, ChallengesDocument, ChallengeStatus, useChallengesQuery } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import { initializeApollo } from "app/lib/apollo-client";
import { getClientConfig } from "app/lib/config";
import { getConfig } from "app/lib/config/rsc";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

interface HomeProps {
  fmType: FlashMessageEnum | null;
}

const Home: React.VoidFunctionComponent<HomeProps> = ({ fmType }) => {
  const { currentUser } = useCurrentUser();
  const flashMessageApi = useFlashMessageApi();

  React.useEffect(() => {
    if (fmType) {
      const { message, type } = getFlashMessage(fmType);
      flashMessageApi.show(message, { type });
    }
  }, [fmType]);

  const { data: dataEasyChallengesOpen } = useChallengesQuery({
    variables: { difficulty: ChallengeDifficulty.Easy, status: ChallengeStatus.Open },
  });

  const { data: dataEasyChallengesFinished } = useChallengesQuery({
    variables: { difficulty: ChallengeDifficulty.Easy, status: ChallengeStatus.Finished },
  });

  const easyChallenges = [...(dataEasyChallengesOpen?.challenges || []), ...(dataEasyChallengesFinished?.challenges || [])];

  const { data: dataChallengesInProgress } = useChallengesQuery({
    variables: { status: ChallengeStatus.InProgress },
  });

  return (
    <>
      <Head>
        <title>a11yphant</title>
        <meta
          name="description"
          content="a11yphant is the easy way to learn the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes."
        />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://a11yphant.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:title" content="a11yphant" />
        <meta
          property="og:description"
          content="a11yphant is the easy way to learn the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes."
        />
        <meta property="og:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@a11yphant" />
        <meta name="twitter:title" content="a11yphant" />
        <meta
          property="twitter:description"
          content="a11yphant is the easy way to learn the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes."
        />
        <meta name="twitter:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation displayBreadcrumbs />
      <main>
        <h1 className={clsx("sr-only")} aria-label="Allyphant">
          a11yphant
        </h1>
        <div className={clsx("w-full h-full")}>
          {!currentUser?.isRegistered && <Hero />}
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

            {dataChallengesInProgress?.challenges.length > 0 && (
              <ChallengeList
                className={clsx("2xl:mx-24")}
                heading={"Continue where you left"}
                challenges={dataChallengesInProgress.challenges}
                displayCompleted={false}
              />
            )}

            {easyChallenges.length > 0 && (
              <ChallengeList
                className={clsx("2xl:mx-24")}
                heading={dataChallengesInProgress?.challenges.length === 0 ? "All challenges" : "Other challenges"}
                challenges={easyChallenges}
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(getConfig().graphqlEndpointServer, null, context);

  const fmType = context.query?.["fm-type"] ?? null;

  await Promise.all([
    getServerSideCurrentUser(apolloClient),
    apolloClient.query({
      query: ChallengesDocument,
    }),
  ]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      fmType,
      config: getClientConfig(),
    },
  };
};

export default Home;
