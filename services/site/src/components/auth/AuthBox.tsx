import Github from "app/components/icons/Github";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

export interface AuthBoxProps {
  mode: "signup" | "login";
}

export const AuthBox = ({ mode }: AuthBoxProps): React.ReactElement => {
  return (
    <>
      <div className="mb-2">
        <a
          href={process.env.NEXT_PUBLIC_SITE_GITHUB_LOGIN_ENDPOINT || "/auth/github"}
          className={clsx(
            "px-8 py-4 mb-2 block w-full text-center align-middle text-white font-normal leading-none rounded border border-white",
            "transition duration-300 group",
            "hover:bg-white hover:text-primary",
          )}
        >
          {mode === "signup" ? "Sign up via Github" : "Login with Github"}
          <Github className={clsx("inline-block h-6 -m-2 ml-6 -mt-3 w-auto text-white", "transition duration-300", "group-hover:text-primary")} />
        </a>
      </div>
      {mode === "signup" && (
        //TODO: link to login pop-up
        <Link href="/">
          <a
            className={clsx(
              "my-1 font-normal text-grey-light border-b-grey-light border-2 rounded max-w-max",
              "transition duration-300",
              "hover:border-transparent",
              "focus:border-transparent",
            )}
          >
            Already have an account? Log in.
          </a>
        </Link>
      )}
      {mode === "login" && (
        //TODO: link to registration pop-up
        <Link href="/">
          <a
            className={clsx(
              "my-1 font-normal text-grey-light border-b-grey-light border-2 rounded max-w-max",
              "transition duration-300",
              "hover:border-transparent",
              "focus:border-transparent",
            )}
          >
            New? Create a free account.
          </a>
        </Link>
      )}
      {mode === "login" && (
        //TODO: link to reset pop-up/page
        <Link href="/">
          <a
            className={clsx(
              "my-1 font-normal text-grey-light border-b-grey-light border-2 rounded max-w-max",
              "transition duration-300",
              "hover:border-transparent",
              "focus:border-transparent",
            )}
          >
            Forgot your password? Reset.
          </a>
        </Link>
      )}
    </>
  );
};
