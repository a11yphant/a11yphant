import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import { CurrentUserDocument, useCurrentUserQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useState } from "react";

import Button from "./buttons/Button";
import UserAvatar from "./icons/UserAvatar";
import UserAccountModal from "./modal/UserAccountModal";

interface NavigationProps {
  displayBreadcrumbs?: boolean;
  displaySave?: boolean;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({ displayBreadcrumbs = true, children }) => {
  const [UserAccountModalOpen, setUserAccountModalOpen] = useState<boolean>(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState<boolean>(false);

  const {
    data: { currentUser },
  } = useCurrentUserQuery();

  return (
    <header className="h-[8%] pt-8 pb-6 px-11 grid grid-cols-4">
      <h1>
        <Link href="/">
          <a
            className={clsx(
              "block text-light border-none col-span-1 max-w-max",
              "transform transition ease-in-out duration-300",
              "motion-safe:hover:scale-110 motion-reduce:border-solid",
            )}
          >
            <A11yphantLogo className="w-36" />
            <span className="sr-only">Allyphant Homepage</span>
          </a>
        </Link>
      </h1>
      {displayBreadcrumbs && (
        <>
          <div className={clsx("justify-center items-center col-span-2 hidden", "lg:flex")}>
            <Breadcrumbs />
          </div>
        </>
      )}
      <div className="flex justify-end items-center col-span-1">
        {children}
        {currentUser?.isRegistered && <UserAvatar className="ml-4" />}
        {!currentUser?.isRegistered && (
          <>
            <Button
              primary
              onClick={() => {
                setRegistrationModalOpen(true);
              }}
              className="mx-4"
            >
              Sign Up
            </Button>{" "}
            <Button
              onClick={() => {
                setUserAccountModalOpen(true);
              }}
            >
              Login
            </Button>
            <UserAccountModal
              signUp={true}
              title={"Sign up to save your progress!"}
              showGithubLogin={true}
              open={registrationModalOpen}
              onClose={() => {
                setRegistrationModalOpen(false);
              }}
              loginLinkText="Already have an account? Log in."
            />
            <UserAccountModal
              signUp={false}
              title={"Login"}
              showGithubLogin={true}
              open={UserAccountModalOpen}
              onClose={() => {
                setUserAccountModalOpen(false);
              }}
              resetLinkText="Forgot your password? Reset."
              registrationLinkText="New? Create a free account."
            />
          </>
        )}
      </div>
    </header>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  await Promise.all([
    apolloClient.query({
      query: CurrentUserDocument,
    }),
  ]);

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default Navigation;
