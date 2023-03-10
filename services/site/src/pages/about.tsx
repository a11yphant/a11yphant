import Footer from "app/components/Footer";
import A11yphantLogoWithoutText from "app/components/icons/A11yphantLogoWithoutText";
import Navigation from "app/components/Navigation";
import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import React from "react";

import a11yphantAnimation from "../../public/images/a11yphant-animation.gif";
import a11yphantStatic from "../../public/images/a11yphant-static.jpg";

const About: React.FunctionComponent = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <Head>
        <title>About | a11yphant</title>
        <meta name="description" content="a11yphant is an interactive online course for web accessibility." />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://a11yphant.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:title" content="About" />
        <meta property="og:description" content="a11yphant is an interactive online course for web accessibility." />
        <meta property="og:image" content="https://a11yphant.com/images/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@a11yphant" />
        <meta name="twitter:title" content="a11yphant" />
        <meta name="twitter:description" content="a11yphant is an interactive online course for web accessibility." />
        <meta name="twitter:image" content="https://a11yphant.com/images/mockups-social-media.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
        <div className={clsx("mx-8 py-8 h-main max-w-screen-3xl mt-12", "sm:mx-12 sm:mt-24", "lg:mx-24")}>
          <h1 className={clsx("mb-8", "h2", "md:h1")}>About</h1>

          <div className="mt-4 flex items-center max-w-80ch">
            <A11yphantLogoWithoutText className="w-28 mr-4" />
            <div>
              <p>
                <span aria-label="Allyphant">a11yphant</span> <span aria-hidden="true">(pronounced [ˈɛlifənt])</span> teaches developers the basics of
                web accessibility. Learn step by step by completing short, interactive coding challenges and quizzes.
              </p>
            </div>
          </div>

          <p className="my-8">
            In an ideal world, all websites are designed and developed so everyone can use them. Sadly, many websites do not comply with web
            accessibility guidelines. Therefore, especially people with impairments and disabilities are barred from using them. One of the main
            problems is that many developers don't know enough about web accessibility. <span aria-label="Allyphant">a11yphant</span> wants to improve
            this situation by giving them a tool for learning accessibility in a fun, interactive way.
          </p>

          {prefersReducedMotion ? (
            <Image
              alt="The a11yphant website where users can complete interactive challenges on web accessibility."
              src={a11yphantStatic}
              quality={100}
              sizes="100vw"
              style={{
                objectFit: "cover",
              }}
            />
          ) : (
            <Image
              alt="The a11yphant website where users can complete interactive challenges on web accessibility."
              src={a11yphantAnimation}
              quality={100}
              sizes="100vw"
              style={{
                objectFit: "cover",
              }}
            />
          )}

          <h2 className="h4 mt-8">
            But what is{" "}
            <span aria-label="Allyphant" className="text-2xl">
              a11yphant
            </span>
            ?
          </h2>

          <p>
            <span aria-label="Allyphant">a11yphant</span> is an interactive online course for web accessibility. In this course, you will revisit web
            development topics from an accessibility perspective. For example, how to make sure that assistive technologies like screen readers can
            interact with the website? Or, what is the purpose of the different semantic HTML elements? These are some of the things you will learn by
            writing meaningful markup and completing quizzes.
          </p>

          <h2 className="h4 mt-8">Coding-Challenges and Quizzes</h2>

          <p>
            Various accessibility topics are split up into short challenges. On <span aria-label="Allyphant">a11yphant</span>, you solve coding levels
            and single-choice quizzes in each challenge. Each level teaches you one thing at a time. Our evaluation provides you with detailed
            feedback on our success criteria. If you struggle to solve a challenge, hints will help you out.
          </p>

          <h2 className="h4 mt-8">Meet the team</h2>

          <p>
            <span aria-label="Allyphant">a11yphant</span> started as a master’s project created by six students at the{" "}
            <a href="https://www.fh-salzburg.ac.at/en/" target="_blank" rel="noopener noreferrer nofollow">
              Salzburg University of Applied Sciences (Austria)<span className="sr-only">(opens in a new tab)</span>
            </a>
            .<span className="font-medium">Concept and Development</span> by <a href="https://dnikub.dev">Daniela Kubesch</a>,{" "}
            <a href="https://lucapircher.at/" target="_blank" rel="noopener noreferrer nofollow">
              Luca Pircher<span className="sr-only">(opens in a new tab)</span>
            </a>
            ,{" "}
            <a href="https://github.com/thomasdax98" target="_blank" rel="noopener noreferrer nofollow">
              Thomas Dax<span className="sr-only">(opens in a new tab)</span>
            </a>{" "}
            and{" "}
            <a href="https://github.com/hntrhfr" target="_blank" rel="noopener noreferrer nofollow">
              Michael Hinterhofer<span className="sr-only">(opens in a new tab)</span>
            </a>
            .<span className="font-medium">Interface and Corporate Design</span> by{" "}
            <a href="https://johannawicht.com/" target="_blank" rel="noopener noreferrer nofollow">
              Johanna Wicht<span className="sr-only">(opens in a new tab)</span>
            </a>{" "}
            and{" "}
            <a href="https://www.fabianhellerdesign.com/" target="_blank" rel="noopener noreferrer nofollow">
              Fabian Heller<span className="sr-only">(opens in a new tab)</span>
            </a>
            .
          </p>

          <p>
            As we hope to make the world more inclusive, we continue developing <span aria-label="Allyphant">a11yphant</span> as an Open Source
            project. So, if you find an accessibility issue or want to contribute or support us in any other way, please{" "}
            <a href="mailto:info@a11yphant.com">let us know</a>.
          </p>

          <h2 className="mt-14 h3">What others say about us:</h2>

          <ul className="mt-4">
            <li>
              <p>
                Article in{" "}
                <a
                  href="https://page-online.de/tools-technik/web-accessability-lernen-mit-a11yphant/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <span className="uppercase text-primary">Page</span> Magazine<span className="sr-only">(opens in a new tab)</span>
                </a>
                (in German)
              </p>
            </li>
            <li>
              <p>
                Featured in the{" "}
                <a
                  href="https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-344/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Smashing Magazine Newsletter #344<span className="sr-only">(opens in a new tab)</span>
                </a>
              </p>
            </li>
            <li>
              <p>
                <a
                  href="https://www.producthunt.com/products/a11yphant?utm_source=badge-featured&amp;utm_medium=badge#a11yphant"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  ProductHunt ranking #11<span className="sr-only">(opens in a new tab)</span>
                </a>{" "}
                on the launch day
              </p>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
