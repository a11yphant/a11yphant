import ChallengeList from "app/components/challengePage/ChallengeList";
import { ChallengeModal } from "app/components/challengePage/challengeModal/ChallengeModal";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessageEnum, getFlashMessage } from "app/components/common/flashMessage/messages/getFlashMessage";
import Footer from "app/components/Footer";
import Hero from "app/components/homepage/Hero";
import SignUpSection from "app/components/homepage/SignUpSection";
import Navigation from "app/components/Navigation";
import { ChallengeDifficulty, ChallengesDocument, ChallengeStatus, useChallengesQuery } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import { initializeApollo } from "app/lib/apollo-client";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface HomeProps {
  fmType: FlashMessageEnum | null;
}

const Home: React.VoidFunctionComponent<HomeProps> = ({ fmType }) => {
  const router = useRouter();
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

  const onCloseModal = (): void => {
    router.push("/", undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>a11yphant - The easy way to learn web accessibility</title>
        <meta
          name="description"
          content="a11yphant teaches the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes. Completely free."
        />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://a11yphant.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:title" content="a11yphant" />
        <meta
          property="og:description"
          content="a11yphant teaches the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes. Completely free."
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
          content="a11yphant teaches the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes. Completely free."
        />
        <meta name="twitter:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className="bg-texture bg-repeat-y bg-contain bg-origin-border bg-top">
        <div className={clsx("h-full max-w-screen-3xl px-8", "sm:px-12", "md:px-24", "xl:px-24", "2xl:mx-auto")}>
          <Hero />
          {!currentUser?.isRegistered && <SignUpSection />}

          {easyChallenges.length > 0 && (
            <ChallengeList
              className={clsx("2xl:mx-24")}
              heading={dataChallengesInProgress?.challenges.length === 0 ? "All challenges" : "Other challenges"}
              challenges={easyChallenges}
            />
          )}
        </div>
      </main>
      <ChallengeModal open={!!router.query.challenge} onClose={onCloseModal} challengeSlug={router.query.challenge as string} />
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

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
    },
  };
};

export default Home;
