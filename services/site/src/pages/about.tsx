import Footer from "app/components/Footer";
import A11yphantLogoWithoutText from "app/components/icons/A11yphantLogoWithoutText";
import Navigation from "app/components/Navigation";
import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import React from "react";

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
        <meta property="og:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@a11yphant" />
        <meta name="twitter:title" content="a11yphant" />
        <meta name="twitter:description" content="a11yphant is an interactive online course for web accessibility." />
        <meta name="twitter:image" content="https://a11yphant.com/images/SEO/mockups-social-media.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
        <div className={clsx("mx-8 py-8 h-main max-w-screen-3xl", "sm:mx-12", "lg:mt-12 lg:mx-24")}>
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
            {prefersReducedMotion ? (
              <Image
                alt="The a11yphant website where users can complete interactive challenges on web accessibility."
                src={a11yphantStatic}
                quality={80}
                placeholder="blur"
                sizes="80ch"
                priority
              />
            ) : (
              <video autoPlay muted loop controls>
                <source src="/videos/a11yphant-showcase.mp4" />
                <p>
                  Your browser doesn't support HTML video. Here is a <a href="/videos/a11yphant-showcase.mp4">link to the video</a> instead.
                </p>
              </video>
            )}
          </div>

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>
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

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>Coding-Challenges and Quizzes</h2>

            <p>
              Various accessibility topics are split up into short challenges. On <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span>, you solve coding levels and single-choice quizzes in each challenge. Each level teaches you
              one thing at a time. Our evaluation provides you with detailed feedback on our success criteria. If you struggle to solve a challenge,
              hints will help you out.
            </p>
          </section>

          <section className="my-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>Meet the team</h2>

            <p>
              <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span> started as a master’s project created by six students at the{" "}
              <InTextLink href="https://www.fh-salzburg.ac.at/en/" target="_blank" rel="noopener noreferrer nofollow">
                Salzburg University of Applied Sciences (Austria)<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              . <span className="font-medium">Concept and Development</span> by <InTextLink href="https://dnikub.dev">Daniela Kubesch</InTextLink>,{" "}
              <InTextLink href="https://lucapircher.at/" target="_blank" rel="noopener noreferrer nofollow">
                Luca Pircher<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              ,{" "}
              <InTextLink href="https://github.com/thomasdax98" target="_blank" rel="noopener noreferrer nofollow">
                Thomas Dax<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>{" "}
              and{" "}
              <InTextLink href="https://github.com/hntrhfr" target="_blank" rel="noopener noreferrer nofollow">
                Michael Hinterhofer<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              . <span className="font-medium">Interface and Corporate Design</span> by{" "}
              <InTextLink href="https://johannawicht.com/" target="_blank" rel="noopener noreferrer nofollow">
                Johanna Wicht<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>{" "}
              and{" "}
              <InTextLink href="https://www.fabianhellerdesign.com/" target="_blank" rel="noopener noreferrer nofollow">
                Fabian Heller<span className="sr-only">(opens in a new tab)</span>
              </InTextLink>
              .
            </p>

            <p>
              As we hope to make the world more inclusive, we continue developing <span className="sr-only">allyphant</span>
              <span aria-hidden="true">a11yphant</span> as an Open Source project. So, if you find an accessibility issue or want to contribute or
              support us in any other way, please <InTextLink href="mailto:info@a11yphant.com">let us know</InTextLink>.
            </p>
          </section>

          <section className="mt-16">
            <h2 className={clsx("mb-8", "h4", "md:h3")}>What others say about us:</h2>

            <h3 className={clsx("h5 mt-8", "md:h4")}>Articles</h3>
            <ul className="mt-4 ml-6 list-disc">
              <li>
                <p>
                  <InTextLink
                    href="https://page-online.de/tools-technik/web-accessability-lernen-mit-a11yphant/"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    "Web Accessability lernen mit a11yphant"
                    <span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by <span className="uppercase">Page</span> Magazine (in German)
                </p>
              </li>
              <li>
                <p>
                  <InTextLink
                    href="https://a11y-guidelines.orange.com/en/articles/watch-february-march-2022/"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
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
                  <InTextLink
                    href="https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-344/"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    "Smashing Newsletter" - Issue #344<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Smashing Magazine
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://a11yweekly.com/issue/285/" target="_blank" rel="noopener noreferrer nofollow">
                    "A11y Weekly" - Issue #285<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by David A. Kennedy
                </p>
              </li>
              <li>
                <p>
                  <InTextLink
                    href="https://stephaniewalter.design/blog/pixels-of-the-week-march-20-2022/"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    "Pixels of the Week"<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by Stéphanie Walter
                </p>
              </li>
              <li>
                <p>
                  <InTextLink href="https://wweb.dev/weekly/108/" target="_blank" rel="noopener noreferrer nofollow">
                    "Weekly Web Development Resources" - Issue #108<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  by wweb.dev (Vincent Will)
                </p>
              </li>
              <li>
                <p>
                  <InTextLink
                    href="https://www.nyu.edu/life/information-technology/web-and-digital-publishing/digital-publishing/accessibility/accessibility-newsletter/accessibility-newsletter-archive/digital-accessibility-news---fall-2022.html"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
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
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    ProductHunt ranking #11<span className="sr-only">(opens in a new tab)</span>
                  </InTextLink>{" "}
                  on the launch day
                </p>
              </li>
              <li>
                <p>
                  <InTextLink
                    href="https://podcasters.spotify.com/pod/show/stacksnacks/episodes/5-Snacks-e1hv3ae"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
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

const InTextLink: React.FunctionComponent<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>> = ({
  children,
  ...props
}) => {
  return (
    <a
      className={clsx(
        "text-light font-sans font-normal border-light",
        "transition-colors duration-300",
        "hover:text-primary-light hover:border-transparent",
        "focus-rounded-instead-of-underline",
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export default About;
