"use client";

import { getConfig } from "app/lib/config";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

import { useFlashMessageApi } from "../common/flashMessage/FlashMessageContext";
import Github from "../icons/Github";
import Twitter from "../icons/Twitter";
import LoginForm from "./LoginForm";
import ThirdPartyAuthLink from "./ThirdPartyAuthLink";
import UnderlinedTextButton from "./UnderlinedTextButton";
import { useUserAccountModalApi } from "./useUserAccountModalApi";

const { githubLoginEndpoint, twitterLoginEndpoint } = getConfig();

const LoginBox: React.FC = () => {
  const userAccountModalApi = useUserAccountModalApi();
  const flashMessageApi = useFlashMessageApi();
  const router = useRouter();

  const onSuccessfulLogin = (): void => {
    flashMessageApi.show("Welcome back!");
    userAccountModalApi.hide();
    router.refresh();
  };

  return (
    <>
      <LoginForm onAfterSubmit={onSuccessfulLogin} />
      <div className="mt-4 mb-8">
        <ThirdPartyAuthLink href={githubLoginEndpoint || "/auth/github"}>
          {"Log in via Github"}
          <Github className={clsx("inline-block h-6 -m-2 ml-6 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
        <ThirdPartyAuthLink href={twitterLoginEndpoint || "/auth/twitter"}>
          {"Log in via Twitter"}
          <Twitter className={clsx("inline-block h-8 -m-2 ml-4 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
      </div>
      <UnderlinedTextButton onClick={() => userAccountModalApi.show("reset-password")}>Forgot your password? Reset it here.</UnderlinedTextButton>
      <UnderlinedTextButton className={clsx("mt-4")} onClick={() => userAccountModalApi.show("signup")}>
        New here? Create a free account.
      </UnderlinedTextButton>
    </>
  );
};

export default LoginBox;
