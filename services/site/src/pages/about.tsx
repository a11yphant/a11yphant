import Footer from "app/components/Footer";
import A11yphantLogoWithoutText from "app/components/icons/A11yphantLogoWithoutText";
import InTextLink from "app/components/links/InTextLink";
import Navigation from "app/components/Navigation";
import { getClientConfig } from "app/lib/config";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";

import a11yphantStatic from "../../public/images/showcase/mockups-social-media-new.png";

const About: React.FunctionComponent = () => {
  // const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <Head>
        <title>About | a11yphant</title>
        <meta
          name="description"
          content="a11yphant is an interactive online course for web accessibility. It was created with love in Austria and is maintained as an Open Source project."
        />
        <meta name="author" content="a11yphant" />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://a11yphant.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:site_name" content="a11yphant" />
        <meta property="og:title" content="About a11yphant" />
        <meta
          property="og:description"
          content="a11yphant is an interactive online course for web accessibility. It was created with love in Austria and is maintained as an Open Source project."
        />
        <meta property="og:image" content="https://a11yphant.com/images/SEO/mockups-ABOUT.jpg" />
        <meta
          property="og:image:alt"
          content="Illustrations of people coding along with a textual description of a11ypahnt's benefits, which are studying from the comfort of your home and interactive coding challenges and quizzes."
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@a11yphant" />
        <meta name="twitter:title" content="About a11yphant" />
        <meta
          name="twitter:description"
          content="a11yphant is an interactive online course for web accessibility. It was created with love in Austria and is maintained as an Open Source project."
        />
        <meta name="twitter:image" content="https://a11yphant.com/images/SEO/mockups-ABOUT.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto mt-32")}>
        <div className={clsx("mx-8 h-main max-w-screen-3xl", "sm:mx-12", "lg:mt-12 lg:mx-24")}>
          <h1 className={clsx("mb-8", "h2", "md:h1")}>About</h1>

          <div className="mt-4 flex items-center max-w-80ch">
            <A11yphantLogoWithoutText className={clsx("w-28 mr-4 hidden", "sm:block")} />
            <div>
              <p>
                <span className="sr-only">allyphant</span>
                <span aria-hidden="true">a11yphant</span> <span aria-hidden="true">(pronounced [ˈɛlifənt])</span> teaches developers the basics of web
                accessibility. Learn step by step by completing short, interactive coding challenges and quizzes.
              </p>
            </div>
          </div>

          <p className="my-8">
            In an ideal world, all websites are designed and developed so everyone can use them. Sadly, many websites do not comply with web
            accessibility guidelines. Therefore, especially people with impairments and disabilities are barred from using them. One of the main
            problems is that many developers don't know enough about web accessibility. <span className="sr-only">allyphant</span>
            <span aria-hidden="true">a11yphant</span> wants to improve this situation by giving them a tool for learning accessibility in a fun,
            interactive way.
          </p>

          <div className="max-w-80ch">
            {/* {prefersReducedMotion ? ( */}
            <Image
              alt="The a11yphant website where users can complete interactive challenges on web accessibility."
              src={a11yphantStatic}
              quality={80}
              placeholder="blur"
              priority
              sizes="80ch"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            {/* ) : (
              <video autoPlay muted loop playsInline controls>
                <source src="/videos/a11yphant-showcase.mp4" />
                <p>
                  Your browser doesn't support HTML video. Here is a <a href="/videos/a11yphant-showcase.mp4">link to the video</a> instead.
                </p>
              </video>
            )} */}
          </div>

          <section className="my-16" aria-labelledby="about1">
            <h2 id="about1" className={clsx("mb-8", "h4", "md:h3")}>
              But what is <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span>?
            </h2>

            <p>
              <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span> is an interactive online course for web accessibility. In this course, you will revisit web
              development topics from an accessibility perspective. For example, how to make sure that assistive technologies like screen readers can
              interact with the website? Or, what is the purpose of the different semantic HTML elements? These are some of the things you will learn
              by writing meaningful markup and completing quizzes.
            </p>
          </section>

          <section className="my-16" aria-labelledby="about2">
            <h2 id="about2" className={clsx("mb-8", "h4", "md:h3")}>
              Coding-Challenges and Quizzes
            </h2>

            <p>
              Various accessibility topics are split up into short challenges. On <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span>, you solve coding levels and single-choice quizzes in each challenge. Each level teaches you
              one thing at a time. Our evaluation provides you with detailed feedback on our success criteria. If you struggle to solve a challenge,
              hints will help you out.
            </p>
          </section>

          <section className="my-16" aria-labelledby="about3">
            <h2 id="about3" className={clsx("mb-8", "h4", "md:h3")}>
              Meet the team
            </h2>

            <p>
              <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span> started as a master’s project created by six students at the{" "}
              <InTextLink href="https://www.fh-salzburg.ac.at/en/" opensInNewTab>
                Salzburg University of Applied Sciences (Austria)<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              . <span className="font-bold">Concept and Development</span> by <InTextLink href="https://dnikub.dev">Daniela Kubesch</InTextLink>,{" "}
              <InTextLink href="https://lucapircher.at/" opensInNewTab>
                Luca Pircher<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              ,{" "}
              <InTextLink href="https://github.com/thomasdax98" opensInNewTab>
                Thomas Dax<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>{" "}
              and{" "}
              <InTextLink href="https://github.com/hntrhfr" opensInNewTab>
                Michael Hinterhofer<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              . <span className="font-bold">Interface and Corporate Design</span> by{" "}
              <InTextLink href="https://johannawicht.com/" opensInNewTab>
                Johanna Wicht<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>{" "}
              and{" "}
              <InTextLink href="https://www.fabianhellerdesign.com/" opensInNewTab>
                Fabian Heller<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              .
            </p>

            <p>
              As we hope to make the world more inclusive, we continue developing <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span> as an Open Source project. So, if you find an accessibility issue or want to contribute or
              support us in any other way, please let us know by writing to{" "}
              <InTextLink href="mailto:info@a11yphant.com">info@a11yphant.com</InTextLink>.
            </p>
          </section>

          <section className="mt-16" aria-labelledby="about4">
            <h2 id="about4" className={clsx("mb-8", "h4", "md:h3")}>
              What others say about us:
            </h2>

            <h3 className={clsx("h5 mt-8", "md:h4")}>Awards</h3>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>
                  <InTextLink href="https://www.adc.de/wettbewerb/talent/" opensInNewTab>
                    <span className="sr-only">One time</span>
                    <span aria-hidden>1x </span>
                    Distinction in "Concept and Design of Digital Services/Products"
                    <span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Art Directors Club (ADC) at the ADC Talent Award 2023
                </p>
              </li>
              <li>
                <p>
                  <InTextLink
                    href="https://creativclub.at/submission/daniela-kubesch-luca-pircher-thomas-dax-michael-hinterhofer-johanna-wicht-fabian-heller-a11yphant/"
                    opensInNewTab
                  >
                    <span className="sr-only">One time</span>
                    <span aria-hidden>1x </span>
                    Shortlist in "Student of the Year"<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Creative Club Austria (CCA) at the CCA Venus 2023
                </p>
              </li>
            </ul>

            <h3 className={clsx("h5 mt-8", "md:h4")}>Articles</h3>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>
                  <InTextLink href="https://page-online.de/tools-technik/web-accessability-lernen-mit-a11yphant/" opensInNewTab>
                    "Web Accessability lernen mit a11yphant"
                    <span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by <span className="uppercase">Page</span> Magazine (in German)
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://a11y-guidelines.orange.com/en/articles/watch-february-march-2022/" opensInNewTab>
                    "Digital accessibility watch February-Maarch 2022"<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Orange
                </p>
              </li>
            </ul>

            <h3 className={clsx("h5 mt-8", "md:h4")}>Newsletters</h3>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>
                  <InTextLink href="https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-344/" opensInNewTab>
                    "Smashing Newsletter" - Issue #344<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Smashing Magazine
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://a11yweekly.com/issue/285/" opensInNewTab>
                    "A11y Weekly" - Issue #285<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by David A. Kennedy
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://stephaniewalter.design/blog/pixels-of-the-week-march-20-2022/" opensInNewTab>
                    "Pixels of the Week"<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Stéphanie Walter
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://wweb.dev/weekly/108/" opensInNewTab>
                    "Weekly Web Development Resources" - Issue #108<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by wweb.dev (Vincent Will)
                </p>
              </li>
              <li>
                <p>
                  <InTextLink
                    href="https://www.nyu.edu/life/information-technology/web-and-digital-publishing/digital-publishing/accessibility/accessibility-newsletter/accessibility-newsletter-archive/digital-accessibility-news---fall-2022.html"
                    opensInNewTab
                  >
                    "Digital Accessibility News" - Issue #18<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by NYU
                </p>
              </li>
            </ul>

            <h3 className={clsx("h5 mt-8", "md:h4")}>Other</h3>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>
                  <InTextLink
                    href="https://www.producthunt.com/products/a11yphant?utm_source=badge-featured&amp;utm_medium=badge#a11yphant"
                    opensInNewTab
                  >
                    ProductHunt ranking #11<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  on the launch day
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://podcasters.spotify.com/pod/show/stacksnacks/episodes/5-Snacks-e1hv3ae" opensInNewTab>
                    "5 Snacks" Episode<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Stack Snacks
                </p>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      config: getClientConfig(context.req.headers.host),
    },
  };
};
