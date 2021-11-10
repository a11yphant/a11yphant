import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Footer: React.FunctionComponent = () => (
  <footer
    className={clsx("max-w-screen-3xl mx-8 mt-32 mb-24", "md:flex md:flex-row md:justify-between", "sm:mx-12 sm:mt-28 sm:mb-12 md:mx-24 2xl:mx-auto")}
  >
    <nav className={clsx("mb-8", "md:mb-0")} aria-label="Footer Navigation">
      <ul>
        <li className={clsx("md:inline-block md:mr-16")}>
          <Link href="/imprint">
            <a className={clsx("text-white font-sans font-normal", "hover:text-primary-light hover:border-transparent")}>Imprint</a>
          </Link>
        </li>
        <li className={clsx("md:inline-block md:mr-16")}>
          <Link href="/privacy-policy">
            <a className={clsx("text-white font-sans font-normal", "hover:text-primary-light hover:border-transparent")}>Privacy Policy</a>
          </Link>
        </li>
      </ul>
    </nav>
    <p>
      Made with{" "}
      <span aria-label="love" role="img">
        💜
      </span>{" "}
      in Salzburg
    </p>
  </footer>
);

export default Footer;
