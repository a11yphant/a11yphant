import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Heart from "./icons/Heart";

const LinkListItem: React.FC<{ href: string; title: string }> = ({ href, title }) => (
  <li className={clsx("mb-0 -ml-4 flex")}>
    <Link
      href={href}
      className={clsx(
        "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
        "transition-colors duration-300",
        "hover:text-primary-light hover:decoration-primary-light",
        "focus-rounded-instead-of-underline",
      )}
    >
      {title}
    </Link>
  </li>
);

const LinkList: React.FC<React.PropsWithChildren> = ({ children }) => <ul className={clsx("mb-0 flex flex-col")}>{children}</ul>;

const Footer: React.FunctionComponent = () => (
  <footer className={clsx("max-w-screen-3xl mx-8 mt-14 mb-16", "sm:mx-12 sm:mt-20 sm:mb-7", "md:mt-28", "md:mx-24", "2xl:mx-auto")}>
    <div className={clsx("xl:flex xl:flex-row xl:justify-between", "2xl:mx-24")}>
      <div className="flex flex-col justify-start">
        <p className={clsx("h5 mb-2 max-w-none")}>The easy way to learn web accessibility</p>
        <p className={clsx("mb-0 max-w-none")}>
          Made with
          <span aria-label="love" role="img" className="px-2">
            💜
          </span>
          in Austria
        </p>
        <p className={clsx("mb-0 mt-5 max-w-none")}>© 2022 - {new Date().getFullYear()}, a11yphant.</p>
      </div>

      <nav className={clsx("mt-10 mb-6 flex flex-col items-start justify-start", "sm:flex-row", "xl:my-0")} aria-label="Footer">
        <div className={clsx("flex flex-col mb-5", "xl:mb-0")}>
          <h3 className="h6 mb-3 uppercase">Project</h3>
          <LinkList>
            <LinkListItem href="/about" title="About" />
            <LinkListItem href="/press-kit" title="Press Kit" />
            <LinkListItem href="https://github.com/sponsors/a11yphant" title="Support us" />
          </LinkList>
        </div>

        <div className={clsx("flex flex-col my-5", "sm:my-0 sm:mx-9")}>
          <h3 className="h6 mb-3 uppercase">Social</h3>
          <LinkList>
            <LinkListItem href="mailto:info@a11yphant.com" title="Contact" />
            <LinkListItem href="https://twitter.com/a11yphant" title="Twitter" />
            <LinkListItem href="https://github.com/a11yphant/a11yphant" title="GitHub" />
          </LinkList>
        </div>

        <div className={clsx("flex flex-col mt-5", "sm:mt-0")}>
          <h3 className="h6 mb-3 uppercase">Site</h3>
          <LinkList>
            <LinkListItem href="/legal-notice" title="Legal Notice" />
            <LinkListItem href="/privacy-policy" title="Privacy Policy" />
          </LinkList>
        </div>
      </nav>

      <div
        className={clsx("flex flex-col items-start justify-start gap-4", "sm:flex-row sm:items-center", "xl:flex-col xl:items-start xl:justify-end")}
      >
        <div className={clsx("mb-0 -ml-3 inline-block", "xl:ml-0")}>
          <Link
            href="https://www.producthunt.com/posts/a11yphant?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-a11yphant"
            className={clsx("group")}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <span className="sr-only">Product Hunt campaign of a11yphant (opens in a new tab)</span>
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=328460&theme=dark"
              alt="Featured on Product Hunt badge"
              width="250"
              height="54"
              className={clsx(
                "border-transparent border-[3px] rounded-lg",
                "transition-colors duration-300",
                "group-hover:border-light",
                "group-focus:border-light",
              )}
            />
          </Link>
        </div>
        <Link
          href="https://github.com/sponsors/a11yphant"
          className={clsx(
            "group text-light bg-[#221d21] px-[1.6rem] py-[0.8rem] flex tracking-wider font-medium -ml-2 sm:ml-0 xl:ml-1",
            "border-transparent border-[3px] rounded-lg",
            "transition-colors duration-300",
            "group-hover:border-light",
            "group-focus:border-light",
          )}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <Heart className="w-4 mr-3" />
          <span aria-label="Sponsor Allyphant (opens in a new tab)">Sponsor a11yphant</span>
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
