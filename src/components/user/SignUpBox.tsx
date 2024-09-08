"use client";

import { useClientConfig } from "app/lib/config";
import clsx from "clsx";
import React from "react";

import { useFlashMessageApi } from "../common/flashMessage/FlashMessageContext";
import Github from "../icons/Github";
import XTwitter from "../icons/XTwitter";
import SignUpForm from "./SignUpForm";
import ThirdPartyAuthLink from "./ThirdPartyAuthLink";
import UnderlinedTextButton from "./UnderlinedTextButton";
import { useUserAccountModalApi } from "./useUserAccountModalApi";

const SignUpBox: React.FC = () => {
  const { githubLoginEndpoint, twitterLoginEndpoint } = useClientConfig();
  const userAccountModalApi = useUserAccountModalApi();
  const flashMessageApi = useFlashMessageApi();

  const onSuccessfulSignUp = (): void => {
    flashMessageApi.show(
      "Welcome! Thank's for signing up. We sent you an e-mail to confirm your account. If you don't see the e-mail, please check your spam folder.",
    );
    userAccountModalApi.hide();
  };

  return (
    <>
      <SignUpForm onAfterSubmit={onSuccessfulSignUp} />
      <div className={clsx("mt-4 mb-8")}>
        <ThirdPartyAuthLink href={githubLoginEndpoint || "/auth/github"}>
          {"Sign Up via Github"}
          <Github className={clsx("inline-block h-6 -m-2 ml-6 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
        <ThirdPartyAuthLink href={twitterLoginEndpoint || "/auth/twitter"}>
          {"Sign Up via X/Twitter"}
          <XTwitter className={clsx("inline-block h-5 -m-2 ml-4 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
      </div>
      <UnderlinedTextButton onClick={() => userAccountModalApi.show("login")}>Already have an account? Log in.</UnderlinedTextButton>
    </>
  );
};

export default SignUpBox;
