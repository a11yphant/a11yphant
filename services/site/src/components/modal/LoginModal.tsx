import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Button from "../buttons/Button";
import Github from "../icons/Github";
import X from "../icons/X";

export interface LoginModalProps {
  open?: boolean;
  onClose?: () => void;
  title: string;
  showGithubLogin?: boolean;
  loginLinkText?: string;
  registrationLinkText?: string;
  resetLinkText?: string;
}

const LoginModal: React.FunctionComponent<LoginModalProps> = ({
  open = false,
  onClose,
  title,
  showGithubLogin,
  loginLinkText,
  registrationLinkText,
  resetLinkText,
}) => {
  return (
    <Transition
      show={open}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog open={open} onClose={() => onClose()} className={clsx("fixed z-10 inset-0 overflow-y-auto h-screen flex items-center justify-center")}>
        <div
          className={clsx(
            "p-8 bg-primary rounded-lg min-w-max max-w-xl flex flex-col relative",
            "md:px-12 md:py-10 md:min-w-[32rem] md:mx-auto",
            "lg:px-16 lg:py-14",
            "xl:px-20 xl:py-16",
          )}
        >
          <Dialog.Overlay className="fixed inset-0 bg-background opacity-25 z-[-1]" />

          <Button
            onClick={() => onClose()}
            overrideClassName
            className={clsx(
              "w-11 h-11 p-3.5 absolute top-4 right-4",
              "transition-colors duration-300",
              "hover:text-primary-light",
              "focus:text-primary-light",
            )}
          >
            <span className="sr-only">Close</span>
            <X />
          </Button>

          <Dialog.Title className={clsx("mb-8", "h4")}>{title}</Dialog.Title>

          <div className="mb-2">
            {showGithubLogin && (
              <a
                href={process.env.NEXT_PUBLIC_SITE_GITHUB_LOGIN_ENDPOINT || "/auth/github"}
                className={clsx(
                  "px-8 py-4 mb-2 block w-full text-center align-middle text-white font-normal leading-none rounded border border-white",
                  "transition duration-300 group",
                  "hover:bg-white hover:text-primary",
                )}
              >
                Sign up via Github
                <Github className={clsx("inline-block h-6 -m-2 ml-6 -mt-3 w-auto text-white", "group-hover:text-primary")} />
              </a>
            )}
          </div>

          {loginLinkText && (
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
                {loginLinkText}
              </a>
            </Link>
          )}
          {registrationLinkText && (
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
                {registrationLinkText}
              </a>
            </Link>
          )}
          {resetLinkText && (
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
                {resetLinkText}
              </a>
            </Link>
          )}
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginModal;
