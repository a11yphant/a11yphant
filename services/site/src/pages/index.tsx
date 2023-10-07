import ChallengeList from "app/components/challengePage/ChallengeList";
import { ChallengeModal } from "app/components/challengePage/challengeModal/ChallengeModal";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessageEnum, getFlashMessage } from "app/components/common/flashMessage/messages/getFlashMessage";
import Footer from "app/components/Footer";
import HeroSection from "app/components/homepage/HeroSection";
import QuoteCard from "app/components/homepage/QuoteCard";
import SignUpSection from "app/components/homepage/SignUpSection";
import TestimonialSection from "app/components/homepage/TestimonialSection";
import USPSection from "app/components/homepage/USPSection";
import IllustrationCouchWoman from "app/components/icons/IllustrationCouchWoman";
import IllustrationPhoneWoman from "app/components/icons/IllustrationPhoneWoman";
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
          <HeroSection />
          {!currentUser?.isRegistered && <SignUpSection />}
          <div className="my-8">
            <USPSection
              imageLeft
              heading="Study from the comfort of your home"
              paragraph="For challenges on a11yphant you won't need to read large amounts. Instead, you will learn by applying the concepts in code."
            >
              <IllustrationCouchWoman className="h-auto mb-4 max-w-[15rem] md:max-w-full md:mb-0" />
            </USPSection>
            <USPSection
              heading="Interactive coding challenges and quizzes"
              paragraph="With a phone, computer or tablet, a11yphant works wherever you are. Get started with your first web accessibility challenge and improve your skills."
            >
              <IllustrationPhoneWoman className="h-auto mb-4 max-w-[15rem] md:max-w-full md:mb-0" />
            </USPSection>
          </div>
          <TestimonialSection>
            <QuoteCard
              quote="Thank you for your wonderful work!"
              author="Vitaly Friedman (@vitalyf)"
              url="https://twitter.com/vitalyf/status/1592382098391842817"
            />
            <QuoteCard
              quote="a11yphant is such a good resource to learn the basics of HTML accessibility by doing."
              author="Kitty Giraudel (@KittyGiraudel)"
              url="https://twitter.com/KittyGiraudel/status/1586278237407440897"
            />
            <QuoteCard
              quote="I shared this with the frontend teams in my company yesterday. Looking forward to it being expanded with more levels and topics."
              author="Daniel Yuschick (@DanielYuschick)"
              url="https://twitter.com/DanielYuschick/status/1504369896460894208"
            />
            <QuoteCard
              quote="Love it - much better than just documentation. Will put it on our developer onboarding list."
              author="@a11y_mmo"
              url="https://twitter.com/a11y_mmo/status/1592598812237139968"
            />
            <QuoteCard
              quote="This is amazing. I was thinking of picking up my accessibility learnings again. This will be useful."
              author="Kehinde (@adeleke5140)"
              url="https://twitter.com/adeleke5140/status/1504164112049356805"
            />
            <QuoteCard
              quote="When thinking about how to train developers on #accessibility (after researching their views) this interactive coding tutorial by a11yphant is what I envisaged.  It's outstanding."
              author="James Buller (@jbuller)"
              url="https://twitter.com/jbuller/status/1512392777346211844"
            />
          </TestimonialSection>

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
