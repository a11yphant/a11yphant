"use client";

import { useClientConfig } from "app/lib/config";
import clsx from "clsx";
import React from "react";

import Button from "../buttons/Button";
import Github from "../icons/Github";
import XTwitter from "../icons/XTwitter";
import { useUserAccountModalApi } from "../user/useUserAccountModalApi";

export interface ChallengeSignUpPromptProps {
  className?: string;
  userLoggedIn: boolean;
}

const ChallengeSignUpPrompt: React.FunctionComponent<ChallengeSignUpPromptProps> = ({ className, userLoggedIn }) => {
  const { githubLoginEndpoint, twitterLoginEndpoint } = useClientConfig();
  const userAccountModalApi = useUserAccountModalApi();

  return (
    <>
      {!userLoggedIn && (
        <section
          className={clsx(
            "flex flex-col -mt-10 mb-20",
            "xs:flex-row-reverse xs:justify-end xs:flex-grow xs:items-center",
            "lg:mb-0",
            "2xl:mx-24",
            className,
          )}
          aria-label="SignUp"
        >
          <p className={clsx("max-w-xs mx-1 mb-0", "xs:ml-4 xs:mt-6", "lg:mr-2 lg:ml-8")}>
            Why not sign up and track your <br></br> stats and save your progress?
          </p>
          <div className="flex flex-col">
            <Button
              primary
              onClick={() => {
                userAccountModalApi.show("signup");
              }}
              overrideClassName
              className={clsx(
                "flex-grow my-4 mx-1 py-2.5 border-primary border-2 rounded tracking-wider",
                "sm:mb-2 sm:px-6",
                "transition duration-300",
                "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
              )}
            >
              Sign Up
            </Button>

            <div className={clsx("flex")}>
              <div className={clsx("max-w-full block ml-1 mr-2 flex-grow")}>
                <a
                  href={githubLoginEndpoint || "/auth/github"}
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
              <div className={clsx("max-w-full block mx-1 flex-grow")}>
                <a
                  href={twitterLoginEndpoint || "/auth/twitter"}
                  className={clsx(
                    "px-10 py-2.5 w-full min-w-max max-w-xs block text-center align-middle rounded border border-light",
                    "group transition duration-300",
                    "hover:bg-light hover:text-primary",
                    "xl:max-w-none",
                  )}
                  aria-label="Sign up via X/Twitter"
                >
                  <XTwitter
                    className={clsx("inline-block h-5 -m-2 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ChallengeSignUpPrompt;
