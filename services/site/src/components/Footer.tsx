import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Footer: React.FunctionComponent = () => (
  <footer className={clsx("max-w-screen-3xl mx-8 mt-10 mb-20", "sm:mx-12 sm:mt-28 sm:mb-12", "md:mx-24", "2xl:mx-auto")}>
    <div className={clsx("md:flex md:flex-row md:justify-between", "2xl:mx-24")}>
      <nav className={clsx("mb-4", "md:mb-0")} aria-label="Footer Navigation">
        <ul className={clsx("mb-0")}>
          <li className={clsx("mb-0 pt-4 pb-4", "md:pt-0 md:pb-0 md:inline-block md:mr-16")}>
            <Link href="/imprint">
              <a
                className={clsx(
                  "py-3 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-visible-outline-offset",
                )}
              >
                Imprint
              </a>
            </Link>
          </li>
          <li className={clsx("mb-0 pt-4 pb-4 inline-block", "md:pt-0 md:pb-0 md:mr-16")}>
            <Link href="/privacy-policy">
              <a
                className={clsx(
                  "py-3 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-visible-outline-offset",
                )}
              >
                Privacy Policy
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <p className={clsx("mb-0")}>
        Made with{" "}
        <span aria-label="love" role="img">
          💜
        </span>{" "}
        in Salzburg
      </p>
    </div>
  </footer>
);

export default Footer;
