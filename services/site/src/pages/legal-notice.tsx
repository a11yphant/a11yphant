import Footer from "app/components/Footer";
import Navigation from "app/components/Navigation";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const LegalNotice: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Legal Notice | a11yphant</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="a11yphant is a master project by 6 students at the University of Applied Sciences Salzburg." />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://a11yphant.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:title" content="Legal Notice" />
        <meta property="og:description" content="a11yphant is a master project by 6 students at the University of Applied Sciences Salzburg." />
        <meta property="og:image" content="https://a11yphant.com/images/mockups-social-media.jpg" />
        <meta
          property="og:image:alt"
          content="A coding challenge in a11yphant with an instruction section, a code editor and a preview section to view the code you have just written."
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@a11yphant" />
        <meta name="twitter:title" content="a11yphant" />
        <meta name="twitter:description" content="a11yphant is a master project by 6 students at the University of Applied Sciences Salzburg." />
        <meta name="twitter:image" content="https://a11yphant.com/images/mockups-social-media.jpg" />
        {/* <!-- General Meta Tags --> */}
        <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      </Head>
      <Navigation />
      <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
        <div className={clsx("mx-8 py-8 h-main max-w-screen-3xl mt-12", "sm:mx-12 sm:mt-24", "lg:mx-24")}>
          <h1 className={clsx("mb-8", "h2", "md:h1")}>Legal Notice</h1>
          <p className={clsx("italic mb-8")}>
            Information obligation according to §5 E-Commerce Law, §14 Corporate Code, §63 Trade Regulations and disclosure obligation according to
            §25 Media Act.
          </p>

          <p>
            <span aria-label="Allyphant">a11yphant</span> is a master's project by six students at the Salzburg University of Applied Sciences. We
            tried our best to make this website accessible. However, we are no experts yet, so please let us know if we missed something.
          </p>

          <address className={clsx("not-italic mb-12")}>
            If you are interested in working with us or just want to know more about the project, simply{" "}
            <Link href={"mailto:info@a11yphant.com"}>
              <a
                className={clsx(
                  "text-light font-sans font-normal border-light",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:border-transparent",
                  "focus-rounded-instead-of-underline",
                )}
              >
                drop us a line
              </a>
            </Link>
            . <br /> <br />
            <strong>University of Applied Sciences Salzburg</strong>
            <br />
            Urstein Süd 3 <br />
            5412 Puch bei Hallein, Austria
          </address>

          <h2 className={clsx("h5 mb-4", "sm:h4")}>Meet the team</h2>
          <h3 className={clsx("h6", "sm:h5")}>Concept and Development</h3>
          <ul className={clsx("list-disc ml-6 mb-8")}>
            <li className={clsx("m-0 my-4")}>
              <Link href={"https://twitter.com/dnikub"}>
                <a
                  target={"_blank"}
                  rel="noopener noreferrer nofollow"
                  className={clsx(
                    "mt-2 text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  Daniela Kubesch <span className={clsx("sr-only")}>(opens in a new tab)</span>
                </a>
              </Link>
            </li>
            <li className={clsx("m-0 my-4")}>
              <Link href={"https://lucapircher.at"}>
                <a
                  target={"_blank"}
                  rel="noopener noreferrer nofollow"
                  className={clsx(
                    "mt-2 text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  Luca Pircher <span className={clsx("sr-only")}>(opens in a new tab)</span>
                </a>
              </Link>
            </li>
            <li className={clsx("m-0 my-4")}>
              <Link href={"https://github.com/thomasdax98"}>
                <a
                  target={"_blank"}
                  rel="noopener noreferrer nofollow"
                  className={clsx(
                    "mt-2 text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  Thomas Dax <span className={clsx("sr-only")}>(opens in a new tab)</span>
                </a>
              </Link>
            </li>
            <li className={clsx("m-0 my-4")}>
              <Link href={"https://github.com/hntrhfr"}>
                <a
                  target={"_blank"}
                  rel="noopener noreferrer nofollow"
                  className={clsx(
                    "mt-2 text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  Michael Hinterhofer <span className={clsx("sr-only")}>(opens in a new tab)</span>
                </a>
              </Link>
            </li>
          </ul>

          <h3 className={clsx("h6", "sm:h5")}>Interface and Corporate Design</h3>
          <ul className={clsx("list-disc ml-6 mb-8")}>
            <li className={clsx("m-0 my-4")}>Johanna Wicht</li>
            <li className={clsx("m-0 my-4")}>Fabian Heller</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LegalNotice;
