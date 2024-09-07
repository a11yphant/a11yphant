import Footer from "app/components/Footer";
import CTASection from "app/components/homepage/CTASection";
import HeroSection from "app/components/homepage/HeroSection";
import IconSection from "app/components/homepage/IconSection";
import MediaSection from "app/components/homepage/MediaSection";
import QuoteCard from "app/components/homepage/QuoteCard";
import SignUpSection from "app/components/homepage/SignUpSection";
import TestimonialSection from "app/components/homepage/TestimonialSection";
import TopChallenge from "app/components/homepage/TopChallenge";
import TopChallengeSection from "app/components/homepage/TopChallengeSection";
import { UseAnimationsContextProvider } from "app/components/homepage/UseAnimationsContext";
import USPSection from "app/components/homepage/USPSection";
import Navigation from "app/components/Navigation";
import { TopThreeChallengesDocument, TopThreeChallengesQueryResult } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import { getServerSideCurrentUser } from "app/lib/server-side-props/get-current-user";
import clsx from "clsx";
import { Metadata } from "next";
import React from "react";

export default async function Home(): Promise<React.ReactElement> {
  const apollo = getApolloClient();
  const currentUser = await getServerSideCurrentUser(apollo);
  const topChallenges = await apollo.query<TopThreeChallengesQueryResult>({
    query: TopThreeChallengesDocument,
  });

  console.log(topChallenges);

  return (
    <>
      <Navigation />
      <UseAnimationsContextProvider>
        <main className="bg-texture bg-repeat-y bg-contain bg-origin-border bg-top mt-32">
          <div className={clsx("h-full max-w-screen-3xl px-8", "sm:px-12", "md:px-24", "xl:px-24", "2xl:mx-auto")}>
            <HeroSection />
            <IconSection />
            <TopChallengeSection>
              {topChallenges.data && (
                <>
                  <TopChallenge challenge={topChallenges.data.challenge1} timesCompleted="1500" isUserFavorite />
                  <TopChallenge challenge={topChallenges.data.challenge2} timesCompleted="1000" />
                  <TopChallenge challenge={topChallenges.data.challenge3} timesCompleted="100" isNew />
                </>
              )}
            </TopChallengeSection>
            <MediaSection />
            {!currentUser?.data.currentUser?.isRegistered && <SignUpSection />}
            <USPSection />
            <TestimonialSection>
              <QuoteCard
                quote="Thank you for your wonderful work!"
                author="Vitaly Friedman (@vitalyf)"
                url="https://x.com/vitalyf/status/1592382098391842817"
              />
              <QuoteCard
                quote="a11yphant is such a good resource to learn the basics of HTML accessibility by doing."
                author="Kitty Giraudel (@KittyGiraudel)"
                url="https://x.com/KittyGiraudel/status/1586278237407440897"
              />
              <QuoteCard
                quote="If you are looking for a way to get started learning about #WebAccessibility, check out a11yphant. Bit sized coding challenges, super fun & interactive."
                author="Josefine Schaefer (@JsfnSchfr)"
                url="https://x.com/JsfnSchfr/status/1698260298551988251"
              />
              <QuoteCard
                quote="When thinking about how to train developers on #accessibility (after researching their views) this interactive coding tutorial by a11yphant is what I envisaged.  It's outstanding."
                author="James Buller (@jbuller)"
                url="https://x.com/jbuller/status/1512392777346211844"
              />
              <QuoteCard
                quote="Love it - much better than just documentation. Will put it on our developer onboarding list."
                author="@a11y_mmo"
                url="https://x.com/a11y_mmo/status/1592598812237139968"
              />
              <QuoteCard
                quote="a11yphant - A cool project that teaches the basics of web accessibility."
                author="Vincent Will (@wweb_dev)"
                url="https://x.com/wweb_dev/status/1491014410487611393"
              />
            </TestimonialSection>
            <CTASection />
          </div>
        </main>
      </UseAnimationsContextProvider>
      <Footer />
    </>
  );
}

export const metadata: Metadata = {};
