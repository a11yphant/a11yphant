import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Footer: React.FunctionComponent = () => (
  <footer className={clsx("max-w-screen-3xl mx-8 mt-10 mb-16", "sm:mx-12 sm:mt-20 sm:mb-7", "md:mt-28", "lg:mx-24", "2xl:mx-auto")}>
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
          <h2 className="h6 mb-3 uppercase">Project</h2>
          <ul className={clsx("mb-0 flex flex-col")}>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="/about"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                About
              </Link>
            </li>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="/press-kit"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Press Kit
              </Link>
            </li>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="https://github.com/a11yphant/a11yphant"
                target={"_blank"}
                rel="noopener noreferrer nofollow"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Support us
              </Link>
            </li>
          </ul>
        </div>

        <div className={clsx("flex flex-col my-5", "sm:my-0 sm:mx-9")}>
          <h2 className="h6 mb-3 uppercase">Social</h2>
          <ul className={clsx("mb-0 flex flex-col")}>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="mailto:info@a11yphant.com"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Contact
              </Link>
            </li>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="https://twitter.com/a11yphant"
                target={"_blank"}
                rel="noopener noreferrer nofollow"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Twitter
              </Link>
            </li>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="https://github.com/a11yphant/a11yphant"
                target={"_blank"}
                rel="noopener noreferrer nofollow"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                GitHub
              </Link>
            </li>
          </ul>
        </div>

        <div className={clsx("flex flex-col mt-5", "sm:mt-0")}>
          <h2 className="h6 mb-3 uppercase">Site</h2>
          <ul className={clsx("mb-0 flex flex-col")}>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="/legal-notice"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Legal Notice
              </Link>
            </li>
            <li className={clsx("mb-0 -ml-4 flex")}>
              <Link
                href="/privacy-policy"
                className={clsx(
                  "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                  "transition-colors duration-300",
                  "hover:text-primary-light hover:decoration-primary-light",
                  "focus-rounded-instead-of-underline",
                )}
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className={clsx("flex items-start justify-start", "xl:justify-end")}>
        <div className={clsx("mb-0 -ml-3 inline-block", "xl:ml-0")}>
          <Link
            href="https://www.producthunt.com/posts/a11yphant?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-a11yphant"
            className={clsx("group")}
            target={"_blank"}
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
      </div>
    </div>
  </footer>
);

export default Footer;
