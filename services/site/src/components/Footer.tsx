import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Footer: React.FunctionComponent = () => (
  <footer className={clsx("max-w-screen-3xl mx-8 mt-10 mb-20", "sm:mx-12 sm:mt-20 sm:mb-12", "md:mt-28", "lg:mx-24", "2xl:mx-auto")}>
    <div className={clsx("lg:flex lg:flex-row lg:justify-between", "2xl:mx-24")}>
      <nav className={clsx("mb-2 flex items-center", "lg:mb-0")} aria-label="Footer">
        <ul className={clsx("mb-0")}>
          <li className={clsx("mb-0 -ml-3 pt-4 pb-4", "lg:pt-0 lg:pb-0 lg:inline-block lg:mr-12")}>
            <Link href="/imprint">
              <a
                className={clsx(
                  "py-3 px-3 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Imprint
              </a>
            </Link>
          </li>
          <li className={clsx("mb-0 -ml-3 pt-4 pb-4 inline-block", "lg:ml-0 lg:pt-0 lg:pb-0 lg:mr-12")}>
            <Link href="/privacy-policy">
              <a
                className={clsx(
                  "py-3 px-6 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
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
      <nav className={clsx("mb-6", "lg:mb-0")} aria-label="Social Links and Sponsors">
        <ul className={clsx("mb-0 flex items-center")}>
          <li className={clsx("mb-0 -ml-3 inline-block", "lg:ml-0 lg:mr-16")}>
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
        </ul>
      </nav>
      <p className={clsx("mb-0 flex items-center")}>
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
