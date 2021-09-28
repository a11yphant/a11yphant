import clsx from "clsx";
import React from "react";

import Github from "../icons/Github";
import Twitter from "../icons/Twitter";

interface ChallengeHeaderProps {
  className?: string;
}

const ChallengeHeader: React.FunctionComponent<ChallengeHeaderProps> = ({ className }) => {
  return (
    <div className={clsx("my-8 flex flex-row justify-between", className)}>
      <div className={clsx("flex flex-col")}>
        <h2 className={clsx("pb-2.5 text-grey", "h3", "sm:h2")}>Challenges</h2>
        <p className={clsx("text-grey-middle")}>Pick a challenge from below</p>
      </div>
      <section className="flex">
        <p className="max-w-xs ml-12 mr-8 my-1">
          Why not sign up and track your <br></br> stats and save your progress?
        </p>
        <div className="flex">
          <div className={clsx("max-w-full block mx-1")}>
            <a
              href={process.env.NEXT_PUBLIC_SITE_GITHUB_LOGIN_ENDPOINT || "/auth/github"}
              className={clsx(
                "px-10 py-2 w-full min-w-max max-w-xs block text-center align-middle rounded border border-light",
                "group transition duration-300",
                "hover:bg-light hover:text-primary",
                "xl:max-w-none",
              )}
            >
              <span className="sr-only">Sign up via Github</span>
              <Github className={clsx("inline-block h-6 -m-2 -mt-3 w-auto text-light", "group-hover:text-primary")} />
            </a>
          </div>
          <div className={clsx("max-w-full block mx-1")}>
            <a
              href={process.env.NEXT_PUBLIC_SITE_TWITTER_LOGIN_ENDPOINT || "/auth/twitter"}
              className={clsx(
                "px-8 py-2 w-full min-w-max max-w-xs block text-center align-middle rounded border border-light",
                "group transition duration-300",
                "hover:bg-light hover:text-primary",
                "xl:max-w-none",
              )}
            >
              <span className="sr-only">Sign up via Twitter</span>
              <Twitter className={clsx("inline-block h-10 -m-2 -mt-3 w-auto text-light", "group-hover:text-primary")} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChallengeHeader;
