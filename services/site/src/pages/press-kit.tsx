import Footer from "app/components/Footer";
import InTextLink from "app/components/links/InTextLink";
import Navigation from "app/components/Navigation";
import { getClientConfig } from "app/lib/config";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import a11yphantLogo from "../../public/images/logo/a11yphant_Logo_combination-mark_dark.png";
import a11yphantLogoLight from "../../public/images/logo/a11yphant_Logo_combination-mark_light.png";
import a11yphantPictorialMark from "../../public/images/logo/a11yphant_Logo_pictorial-mark.png";
import a11yphantWebsiteCodingLevel from "../../public/images/showcase/a11yphant_coding_challenge.png";
import a11yphantWebsiteQuizLevel from "../../public/images/showcase/a11yphant_quiz_challenge.png";
import a11yphantWebsiteAbout from "../../public/images/showcase/mockups-ABOUT.png";
import a11yphantWebsiteChallenge from "../../public/images/showcase/mockups-challenge.png";
import a11yphantWebsiteChallenges from "../../public/images/showcase/mockups-challenges.png";
import a11yphantWebsiteHome from "../../public/images/showcase/mockups-social-media-new.png";

const PressKit: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Press Kit | a11yphant</title>
        <meta
          name="description"
          content="This press kit has all the resources you need when you want to write about a11yphant: Images, Logos and descriptions about the creators and their motivation."
        />
        <meta name="author" content="a11yphant" />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://a11yphant.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:site_name" content="a11yphant" />
        <meta property="og:title" content="Press Kit | a11yphant" />
        <meta
          property="og:description"
          content="This press kit has all the resources you need when you want to write about a11yphant: Images, Logos and descriptions about the creators and their motivation."
        />
        <meta property="og:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A screenshot compilation of the homepage, a quiz and a coding level on a11yphant. The homepage shows an illustration of a person coding and the text `learning web accessibility made easy`. The quiz is multiple choice and the coding level consists of an instruction section, a code editor and a preview section to view the code one has just written."
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@a11yphant" />
        <meta name="twitter:title" content="Press Kit | a11yphant" />
        <meta
          name="twitter:description"
          content="This press kit has all the resources you need when you want to write about a11yphant: Images, Logos and descriptions about the creators and their motivation."
        />
        <meta name="twitter:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto mt-32")}>
        <div className={clsx("mx-8 h-main max-w-screen-3xl", "sm:mx-12", "lg:mt-12 lg:mx-24")}>
          <section className="mb-16">
            <h1 className={clsx("mb-8", "h2", "md:h1")}>Press Kit</h1>
            <p>
              Here you can find more information about the origin of and motivation behind a11yphant. We also provide some pictures and logos for you
              to use if you want to write about us.
            </p>
          </section>

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>The Motivation</h2>
            <p className="my-8">
              In an ideal world, all websites are designed and developed so everyone can use them. Sadly, many websites do not comply with web
              accessibility guidelines. Therefore, especially people with impairments and disabilities are barred from using them. One of the main
              problems is that many developers don't know enough about web accessibility. a11yphant wants to improve this situation by giving them a
              tool for learning accessibility in a fun, interactive way.
            </p>

            <p className="my-8">
              a11yphant teaches developers the basics of web accessibility. Learn step by step by completing short, interactive coding challenges and
              quizzes.
            </p>
          </section>

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>What does a11yphant mean?</h2>

            <p>
              The name a11yphant is a combination of the numeronym "a11y", which is an abbreviation for "accessibility", and the word "elephant". We
              chose "elephant" as part of our name because elephants are very smart animals and we like them.{" "}
            </p>
          </section>

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>How do I pronounce a11yphant?</h2>

            <p>
              In the accessibility community, the term "a11y" is often pronounced as "ally" because the number "1" looks similar to the letter "l",
              depending on the font. Therefore a11yphant is pronounced as <span className="sr-only">allyphant</span>
              <span aria-hidden="true">[ˈɛlifənt]</span>.
            </p>
          </section>

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>Corporate Identity</h2>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>a11yphant is always written in lowercase letters.</p>
              </li>
              <li>
                <p>The a11yphant color code is #7331FF.</p>
              </li>
              <li>
                <p>The fonts we use are "IBM Plex Sans" and "IBM Plex Mono".</p>
              </li>
            </ul>

            <h3 className={clsx("my-8", "h5", "md:h4")}>Logo</h3>
            <p>
              The a11yphant logo is a combination mark. Depending on the case, using only the pictorial mark is allowed. The logo can't be altered in
              any way (strech, rotate, crop, change the opacity or colour, change the font, put something else on top, etc.).
            </p>
            <ul className="mt-4">
              <li>
                <h4 className={clsx("h5 mt-8 mb-4")}>
                  Combination mark <span className={clsx("font-normal h6")}>(dark on light background)</span>
                </h4>
                <div className="max-w-[50ch]">
                  <Image alt="a11yphant Logo Dark" src={a11yphantLogo} placeholder="blur" sizes="80ch" quality={100} />
                </div>
              </li>
              <li>
                <h4 className={clsx("h5 mt-8")}>
                  Combination mark <span className={clsx("font-normal h6")}>(light on dark background)</span>
                </h4>
                <div className="max-w-[50ch]">
                  <Image alt="a11yphant Logo Light" src={a11yphantLogoLight} placeholder="blur" sizes="80ch" quality={100} />
                </div>
              </li>
              <li>
                <h4 className={clsx("h5 mt-8")}>Pictorial mark</h4>
                <div className="max-w-[20ch]">
                  <Image alt="a11yphant Logo" src={a11yphantPictorialMark} placeholder="blur" sizes="80ch" quality={100} />
                </div>
              </li>
            </ul>
          </section>

          <section className="mt-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>The Team behind a11yphant</h2>

            <h3 className={clsx("h5 mt-8", "md:h4")}>Concept and Development</h3>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>
                  <InTextLink href="https://dnikub.dev" opensInNewTab>
                    Daniela Kubesch
                    <span className="sr-only"> (opens in a new tab)</span>
                  </InTextLink>{" "}
                  is a frontend developer who is passionate about accessibility and inclusive design. She strongly believes in equality and inclusion.
                  Daniela is co-founder of a11yphant. When she is not coding, she juggles all things of organisational nature.
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://lucapircher.at" opensInNewTab>
                    Luca Pircher
                    <span className="sr-only"> (opens in a new tab)</span>
                  </InTextLink>{" "}
                  is a web developer based in Austria who firmly believes the web should be inclusive. At a11yphant, Luca supports the team as the
                  "Technical Project Lead" by ensuring that the project is a joy to work on for the dev team and planning the technical requirements
                  for upcoming challenges.
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://github.com/thomasdax98" opensInNewTab>
                    Thomas Dax
                    <span className="sr-only"> (opens in a new tab)</span>
                  </InTextLink>{" "}
                  is a full-stack developer interested in product development and developer experience. As "Head of Text", he has supported the team
                  with copywriting since co-founding a11yphant. Thomas further does a lot of frontend development work and takes care of the
                  development setup.
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://github.com/hntrhfr" opensInNewTab>
                    Michael Hinterhofer
                    <span className="sr-only"> (opens in a new tab)</span>
                  </InTextLink>{" "}
                  is a corporate backend developer on weekdays and "Chief of Happiness Officer" for a11yphant on the weekend. Since co-founding
                  a11yphant, he supported the team with his magic in the backend.
                </p>
              </li>
            </ul>

            <h3 className={clsx("h5 mt-8", "md:h4")}>Interface and Corporate Design</h3>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>
                  <InTextLink href="https://johannawicht.com" opensInNewTab>
                    Johanna Wicht
                    <span className="sr-only"> (opens in a new tab)</span>
                  </InTextLink>{" "}
                  is a communication designer based in Salzburg with a strong interest in visualizing data and identities. She received multiple
                  awards, including ADC Talent and CCA Student of the year.
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://www.fabianhellerdesign.com" opensInNewTab>
                    Fabian Heller
                    <span className="sr-only"> (opens in a new tab)</span>
                  </InTextLink>{" "}
                  is an interdisciplinary digital designer at the intersection of Graphic Design, Motion Design and Illustration. He received multiple
                  awards for his work in these fields.
                </p>
              </li>
            </ul>
          </section>

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>Application Screenshots</h2>
            <div className="flex flex-wrap items-center">
              <div className="w-[70ch] h-full my-6 md:m-8">
                <Image
                  alt="A screenshot compilation of the homepage, a quiz and a coding level on a11yphant. The homepage shows an illustration of a person coding and the text `learning web accessibility made easy`. The quiz is multiple choice and the coding level consists of an instruction section, a code editor and a preview section to view the code one has just written."
                  src={a11yphantWebsiteHome}
                  placeholder="blur"
                  quality={100}
                />
              </div>
              <div className="w-[70ch] h-full my-6 md:m-8">
                <Image
                  alt="Illustrations of people coding along with a textual description of a11ypahnt's benefits, which are studying from the comfort of your home and interactive coding challenges and quizzes."
                  src={a11yphantWebsiteAbout}
                  placeholder="blur"
                  quality={100}
                />
              </div>
              <div className="w-[70ch] h-full my-6 md:m-8">
                <Image
                  alt="A screenshot showing all available challenges on a11yphant and their difficulty."
                  src={a11yphantWebsiteChallenges}
                  placeholder="blur"
                  quality={100}
                />
              </div>
              <div className="w-[70ch] h-full my-6 md:m-8">
                <Image
                  alt="A screenshot of the a11yphant challenge page, displaying all possible quiz and coding levels to complete."
                  src={a11yphantWebsiteChallenge}
                  placeholder="blur"
                  quality={100}
                />
              </div>

              <div className="w-[70ch] h-full my-6 md:m-8">
                <Image
                  alt="Screenshot of a coding level within a challenge on a11yphant. It consist of an editor, a sidebar with information and a preview window."
                  src={a11yphantWebsiteCodingLevel}
                  placeholder="blur"
                  quality={100}
                />
              </div>
              <div className="w-[70ch] h-full my-6 md:m-8">
                <Image
                  alt="Screenshot of a quiz level on a11yphant, consisting of a question and four possible answers."
                  src={a11yphantWebsiteQuizLevel}
                  placeholder="blur"
                  quality={100}
                />
              </div>
            </div>
          </section>

          <section className="mt-24">
            <p className={clsx("text-base", "md:text-xl")}>
              Want to know more? Send us an email with your question to{" "}
              <Link
                href={"mailto:info@a11yphant.com"}
                className={clsx(
                  "text-light font-sans font-normal border-light",
                  "text-base",
                  "md:text-xl",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:border-transparent",
                  "focus-rounded-instead-of-underline",
                )}
              >
                info@a11yphant.com
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PressKit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      config: getClientConfig(context.req.headers.host),
    },
  };
};
