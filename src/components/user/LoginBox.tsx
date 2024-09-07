"use client";

import { useClientConfig } from "app/lib/config";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

import Github from "../icons/Github";
import XTwitter from "../icons/XTwitter";
import LoginForm from "./LoginForm";
import ThirdPartyAuthLink from "./ThirdPartyAuthLink";
import UnderlinedTextButton from "./UnderlinedTextButton";
import { useUserAccountModalApi } from "./useUserAccountModalApi";

const LoginBox: React.FC = () => {
  const { githubLoginEndpoint, twitterLoginEndpoint } = useClientConfig();
  const userAccountModalApi = useUserAccountModalApi();
  const router = useRouter();

  const onSuccessfulLogin = (): void => {
    userAccountModalApi.hide();
    router.push("?fm-type=login-success");
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
          {"Log in via X/Twitter"}
          <XTwitter className={clsx("inline-block h-5 -m-2 ml-4 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
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
