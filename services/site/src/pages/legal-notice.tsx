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
        <meta name="description" content="a11yphant is an interactive online course for web accessibility." />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://a11yphant.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:title" content="Legal Notice" />
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
        <div className={clsx("mx-8 py-8 h-main max-w-screen-3xl", "sm:mx-12", "lg:mt-12 lg:mx-24")}>
          <h1 className={clsx("mb-8", "h2", "md:h1")}>Legal Notice</h1>
          <p className={clsx("italic mb-8")}>
            Information obligation according to §5 E-Commerce Law, §14 Corporate Code, §63 Trade Regulations and disclosure obligation according to
            §25 Media Act.
          </p>

          <h2 className={clsx("h5", "sm:h4")}>Contact Information</h2>
          <address className={clsx("not-italic mb-12")}>
            <p>
              <strong>Daniela Kubesch, BSc</strong> <br />
              Wiesengasse 18 <br />
              3001 Mauerbach <br />
              Austria
            </p>
            <p>
              <strong>Email: </strong>{" "}
              <Link href={"mailto:info@a11yphant.com"}>
                <a
                  className={clsx(
                    "text-light font-sans font-normal border-light",
                    "transition-colors duration-300",
                    "hover:text-primary-light hover:border-transparent",
                    "focus-rounded-instead-of-underline",
                  )}
                >
                  info@a11yphant.com
                </a>
              </Link>
            </p>
          </address>

          <h2 className={clsx("h5 mb-4", "sm:h4")}>Responsible for the Content</h2>
          <ul className={clsx("list-disc ml-6 mb-8")}>
            <li className={clsx("m-0 my-4")}>
              <Link href={"https://dnikub.dev/"}>
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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LegalNotice;
