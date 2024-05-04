"use client";

import { Menu } from "@headlessui/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { CurrentUserDocument, useLogoutMutation } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import Button from "./buttons/Button";
import Dropdown from "./common/dropdown/Dropdown";
import A11yphantLogo from "./icons/A11yphantLogo";
import UserAvatar from "./icons/UserAvatar";

export interface NavigationProps {
  displayBreadcrumbs?: boolean;
  displaySave?: boolean;
  isSticky?: boolean;
}

const Navigation: React.FC<React.PropsWithChildren<NavigationProps>> = ({ displayBreadcrumbs = true, isSticky = true, children }) => {
  const { currentUser } = useCurrentUser();
  const [triggerLogout] = useLogoutMutation({
    refetchQueries: [{ query: CurrentUserDocument }],
  });
  const userAccountModalApi = useUserAccountModalApi();
  const router = useRouter();

  const logout = async (): Promise<void> => {
    await triggerLogout();
    router.push("/");
  };

  return (
    <>
      <header
        className={clsx(
          "pt-2 pb-4 px-6 sm:px-8 grid grid-cols-12 z-20 bg-background",
          "sm:px-11",
          "md:pt-4",
          "lg:pb-2 lg:pt-1",
          isSticky && "fixed top-0 w-full",
          !isSticky && "relative",
        )}
      >
        <Link
          href="/"
          className={clsx(
            "block text-light border-none rounded col-span-4 max-w-max py-1 px-2 -ml-2",
            "transition ease-in-out duration-300",
            "motion-safe:hover:scale-110 motion-reduce:border-solid",
            "focus-outline-offset",
          )}
        >
          <A11yphantLogo className="w-48 xs:w-52 md:w-36" />
          <span className="sr-only">Allyphant Homepage</span>
        </Link>

        {/* Mobile Nav */}
        <div className={clsx("flex justify-end items-center col-span-8", "md:hidden")}>
          {children}
          <nav className={clsx("mt-2")} aria-label="Main">
            <Dropdown
              hamburger
              isSticky={isSticky}
              triggerButton={
                <Dropdown.TriggerButton
                  className={clsx(
                    "flex flex-row items-center py-0 ml-2 pl-2 border-none rounded underline decoration-transparent underline-offset-4 decoration-2",
                    "hover:text-primary-light hover:decoration-primary-light motion-safe:transition-colors transition-300 align-middle",
                    "focus:outline-offset-2",
                  )}
                >
                  <span>Menu</span>
                  <span className={clsx("text-4xl -mt-2 pl-1")} aria-hidden="true">
                    &#9776;
                  </span>
                </Dropdown.TriggerButton>
              }
            >
              <Dropdown.Group>
                <Dropdown.Link href={"/challenges"}>Challenges</Dropdown.Link>
                {currentUser?.isRegistered && <Dropdown.Link href={`/profile/${currentUser?.id}`}>Public Profile</Dropdown.Link>}
              </Dropdown.Group>
              {!currentUser?.isRegistered && (
                <Dropdown.Group>
                  <div className="flex flex-col items-center mt-4">
                    <Menu.Item>
                      {() => (
                        <Button
                          onClick={() => {
                            userAccountModalApi.show("login");
                          }}
                          className="mb-2 min-w-full justify-center"
                        >
                          Login
                        </Button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {() => (
                        <Button
                          onClick={() => {
                            userAccountModalApi.show("signup");
                          }}
                          primary
                          className="my-2 min-w-full justify-center"
                        >
                          Sign Up
                        </Button>
                      )}
                    </Menu.Item>
                  </div>
                </Dropdown.Group>
              )}
              {currentUser?.isRegistered && (
                <Dropdown.Group>
                  <Dropdown.Button onClick={() => logout()}>Logout</Dropdown.Button>
                </Dropdown.Group>
              )}
            </Dropdown>
          </nav>
        </div>

        <div className={clsx("flex justify-end items-center col-span-8 mt-1.5", "hidden md:block")}>
          {children}
          <nav className={clsx("justify-end items-center", "sm:flex")} aria-label="Main">
            <Link
              href="/challenges"
              className={clsx(
                "py-1.5 px-4 text-light font-sans font-normal border-none underline decoration-transparent underline-offset-4 decoration-2",
                "transition-colors duration-300",
                "hover:text-primary-light hover:decoration-primary-light",
                "focus-rounded-instead-of-underline",
              )}
            >
              Challenges
            </Link>
            {!currentUser?.isRegistered && (
              <>
                <Button
                  onClick={() => {
                    userAccountModalApi.show("login");
                  }}
                  className={clsx("ml-4 py-3 border-primary", "hover:border-primary-dark", "focus:bg-transparent")}
                >
                  Login
                </Button>
                <Button
                  primary
                  onClick={() => {
                    userAccountModalApi.show("signup");
                  }}
                  className={clsx("ml-2 xl:ml-4", "hidden md:block")}
                >
                  Sign Up
                </Button>{" "}
              </>
            )}
            {currentUser?.isRegistered && (
              <Dropdown
                triggerButton={
                  <Dropdown.TriggerButton
                    className={clsx(
                      "hover:text-primary-light motion-safe:transition-colors transition-300 align-middle rounded",
                      "focus:outline-offset-2",
                    )}
                  >
                    <span className={clsx("sr-only")}>User Menu</span>
                    <UserAvatar />
                  </Dropdown.TriggerButton>
                }
              >
                <Dropdown.Group>
                  <Dropdown.Link href={`/profile/${currentUser?.id}`}>Public Profile</Dropdown.Link>
                </Dropdown.Group>
                <Dropdown.Group>
                  <Dropdown.Button onClick={() => logout()}>Logout</Dropdown.Button>
                </Dropdown.Group>
              </Dropdown>
            )}
          </nav>
        </div>
        {displayBreadcrumbs && (
          <div className={clsx("mt-2 col-span-12 w-fit-content self-center", "md:mt-0", "lg:mt-0 lg:col-span-6")}>
            <Breadcrumbs />
          </div>
        )}
      </header>
      <FlashMessagePortalRoot />
    </>
  );
};

export default Navigation;
