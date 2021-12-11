import clsx from "clsx";
import getConfig from "next/config";
import React from "react";

import Github from "../icons/Github";
import Twitter from "../icons/Twitter";
import InlineButton from "./InlineButton";
import LoginForm from "./LoginForm";
import ThirdPartyAuthLink from "./ThirdPartyAuthLink";
import { useUserAccountModalApi } from "./useUserAccountModalApi";

const { publicRuntimeConfig } = getConfig();

const LoginBox: React.FC = () => {
  const userAccountModalApi = useUserAccountModalApi();

  const onSuccessfulLogin = (): void => {
    userAccountModalApi.hide();
  };

  return (
    <>
      <LoginForm onSuccessfulLogin={onSuccessfulLogin} />
      <div className="mb-2">
        <ThirdPartyAuthLink href={publicRuntimeConfig.githubLoginEndpoint || "/auth/github"}>
          {"Log in via Github"}
          <Github className={clsx("inline-block h-6 -m-2 ml-6 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
        <ThirdPartyAuthLink href={publicRuntimeConfig.twitterLoginEndpoint || "/auth/twitter"}>
          {"Log in via Twitter"}
          <Twitter className={clsx("inline-block h-8 -m-2 ml-4 -mt-3 w-auto text-light", "transition duration-300", "group-hover:text-primary")} />
        </ThirdPartyAuthLink>
      </div>
      <InlineButton onClick={() => userAccountModalApi.show("signup")}>New here? Create a free account.</InlineButton>
      {/*  //TODO: link to reset pop-up/page*/}
      {/*  <Link href="/">*/}
      {/*    <a*/}
      {/*      className={clsx(*/}
      {/*        "my-1 font-normal text-grey-light border-b-grey-light border-2 rounded max-w-max",*/}
      {/*        "transition duration-300",*/}
      {/*        "hover:border-transparent",*/}
      {/*        "focus:border-transparent",*/}
      {/*      )}*/}
      {/*    >*/}
      {/*      Forgot your password? Reset.*/}
      {/*    </a>*/}
      {/*  </Link>*/}
      {/*)}*/}
    </>
  );
};

export default LoginBox;
