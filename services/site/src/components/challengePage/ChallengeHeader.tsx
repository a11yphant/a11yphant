import clsx from "clsx";
import getConfig from "next/config";
import React from "react";

import Button from "../buttons/Button";
import Github from "../icons/Github";
import Twitter from "../icons/Twitter";
import { useUserAccountModalApi } from "../user/useUserAccountModalApi";

const { publicRuntimeConfig } = getConfig();

export interface ChallengeHeaderProps {
  className?: string;
  userLoggedIn?: boolean;
}

const ChallengeHeader: React.FunctionComponent<ChallengeHeaderProps> = ({ className, userLoggedIn }) => {
  const userAccountModalApi = useUserAccountModalApi();

  return (
    <div className={clsx("my-4 flex flex-row justify-between", "md:my-8", className)}>
      <div className={clsx("flex flex-col")}>
        <h2 className={clsx("pb-2.5 text-grey", "h3", "sm:h2")}>Challenges</h2>
        <p className={clsx("text-grey ml-1")}>Pick a challenge from below</p>
      </div>
      {!userLoggedIn && (
        <section className={clsx("hidden", "lg:flex")}>
          <p className={clsx("max-w-xs ml-12 mr-8 my-1")}>
            Why not sign up and track your <br></br> stats and save your progress?
          </p>
          <div>
            <Button
              primary
              onClick={() => {
                userAccountModalApi.show("signup");
              }}
              overrideClassName
              className={clsx(
                "mx-1 mb-2 px-16 py-2.5 border-primary border-2 rounded tracking-wider",
                "transition duration-300",
                "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
              )}
            >
              Sign Up
            </Button>

            <div className={clsx("flex")}>
              <div className={clsx("max-w-full block ml-1 mr-2")}>
                <a
                  href={publicRuntimeConfig.githubLoginEndpoint || "/auth/github"}
                  className={clsx(
                    "px-10 py-2.5 w-full min-w-max max-w-xs block text-center align-middle rounded border border-light",
                    "group transition duration-300",
                    "hover:bg-light hover:text-primary",
                    "xl:max-w-none",
                  )}
                  aria-label="Sign up via Github"
                >
                  <Github className={clsx("inline-block h-6 -m-2 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
                </a>
              </div>
              <div className={clsx("max-w-full block mx-1")}>
                <a
                  href={publicRuntimeConfig.twitterLoginEndpoint || "/auth/twitter"}
                  className={clsx(
                    "px-8 py-2.5 w-full min-w-max max-w-xs block text-center align-middle rounded border border-light",
                    "group transition duration-300",
                    "hover:bg-light hover:text-primary",
                    "xl:max-w-none",
                  )}
                  aria-label="Sign up via Twitter"
                >
                  <Twitter
                    className={clsx("inline-block h-10 -m-2 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ChallengeHeader;
