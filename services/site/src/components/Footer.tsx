import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Footer: React.FunctionComponent = () => (
  <footer className={clsx("max-w-screen-3xl mx-8 mt-10 mb-20", "sm:mx-12 sm:mt-20 sm:mb-12", "md:mt-28", "lg:mx-24", "2xl:mx-auto")}>
    <div className={clsx("xl:flex xl:flex-row xl:justify-between", "2xl:mx-24")}>
      <nav className={clsx("mb-2 flex items-center justify-start", "sm:justify-center", "xl:justify-start xl:mb-0")} aria-label="Footer">
        <ul className={clsx("mb-0 flex")}>
          <li className={clsx("mb-0 -ml-4 pt-4 pb-4", "xl:pt-0 xl:pb-0 xl:inline-block xl:mr-4")}>
            <Link href="/imprint">
              <a
                className={clsx(
                  "py-3 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Imprint
              </a>
            </Link>
          </li>
          <li className={clsx("mb-0 -ml-3 pt-4 pb-4 inline-block", "xl:ml-0 xl:pt-0 xl:pb-0 xl:mr-4")}>
            <Link href="/privacy-policy">
              <a
                className={clsx(
                  "py-3 px-8 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Privacy Policy
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <nav className={clsx("mb-6", "xl:mb-0")} aria-label="Social Links and Sponsors">
        <ul className={clsx("mb-0 flex items-center justify-start", "sm:justify-center", "xl:justify-start")}>
          <li className={clsx("mb-0 -ml-3 mr-8 inline-block", "xl:ml-0 xl:mr-8")}>
            <Link href="https://splitbee.io/?ref=badge">
              <a className={clsx("group")} target={"_blank"} rel="noopener noreferrer nofollow">
                <span className="sr-only">Splitbee Analytics (opens in a new tab)</span>
                <img
                  src="https://splitbee-cdn.fra1.cdn.digitaloceanspaces.com/static/badge/splitbee-badge-dark.svg"
                  alt="Analytics by Splitbee.io"
                  className={clsx(
                    "border-transparent border-[3px] rounded-lg",
                    "transition-colors duration-300",
                    "group-hover:border-light",
                    "group-focus:border-light",
                  )}
                />
              </a>
            </Link>
          </li>
          <li className={clsx("mb-0 -ml-3 inline-block", "xl:ml-0 xl:mr-8")}>
            <Link href="https://www.producthunt.com/posts/a11yphant?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-a11yphant">
              <a className={clsx("group")} target={"_blank"} rel="noopener noreferrer nofollow">
                <span className="sr-only">Product Hunt campaign of a11yphant (opens in a new tab)</span>
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=328460&theme=dark"
                  alt="Featured on Product Hunt badge"
                  // style="width: 250px; height: 54px;"
                  width="250"
                  height="54"
                  className={clsx(
                    "border-transparent border-[3px] rounded-lg",
                    "transition-colors duration-300",
                    "group-hover:border-light",
                    "group-focus:border-light",
                  )}
                />
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <p className={clsx("mb-0 flex items-center max-w-none justify-start", "sm:justify-center", "xl:justify-start")}>
        Made with
        <span aria-label="love" role="img" className="px-2">
          💜
        </span>
        in Salzburg
      </p>
    </div>
  </footer>
);

export default Footer;
