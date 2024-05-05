import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import ErrorWithIllustration from "app/components/ErrorWithIllustration";
import Footer from "app/components/Footer";
import FullScreenLayout from "app/components/layouts/FullScreenLayout";
import Navigation from "app/components/Navigation";
import PasswordResetForm from "app/components/passwordReset/PasswordResetForm";
import {
  ValidatePasswordResetTokenResultEnum,
  ValidateResetPasswordTokenDocument,
  ValidateResetPasswordTokenMutation,
  ValidateResetPasswordTokenMutationVariables,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import { getClientConfig } from "app/lib/config";
import { getConfig } from "app/lib/config/rsc";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import React from "react";

export interface ResetPasswordProps {
  token: string;
  tokenValidationResult: ValidatePasswordResetTokenResultEnum;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token, tokenValidationResult }) => {
  const flashMessageApi = useFlashMessageApi();

  function onAfterSubmit(): void {
    flashMessageApi.show("Your password has been reset. You can now log in with your new password.");
  }

  return (
    <>
      <FullScreenLayout header={<Navigation />} footer={<Footer />}>
        <main className={clsx("h-full box-border max-w-screen-3xl mx-auto")}>
          <div className={clsx("mx-8 py-8 h-main", "lg:mx-24")}>
            {tokenValidationResult === ValidatePasswordResetTokenResultEnum.InvalidToken && (
              <ErrorWithIllustration error="Invalid token" text="Something is wrong with the URL... Make sure to copy the entire link." />
            )}
            {[ValidatePasswordResetTokenResultEnum.Expired || ValidatePasswordResetTokenResultEnum.UnknownUser].includes(tokenValidationResult) && (
              <ErrorWithIllustration error="Invalid token" text="This link doesn't work anymore. Please request a new reset link and try again." />
            )}
            {tokenValidationResult === ValidatePasswordResetTokenResultEnum.Valid && (
              <>
                <h1 className={clsx("mt-12 mb-8 text-5xl")}>Reset your password</h1>
                <PasswordResetForm token={token} onAfterSubmit={onAfterSubmit} />
              </>
            )}
          </div>
        </main>
      </FullScreenLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ResetPasswordProps> = async (context) => {
  const apolloClient = initializeApollo(getConfig().getGraphqlEndpointUrl(context.req.url), null, context);

  const token = context.query.token as string;

  const { data } = await apolloClient.mutate<ValidateResetPasswordTokenMutation, ValidateResetPasswordTokenMutationVariables>({
    mutation: ValidateResetPasswordTokenDocument,
    variables: { token },
  });

  return {
    props: {
      token,
      tokenValidationResult: data.validatePasswordResetToken.result,
      config: getClientConfig(),
    },
  };
};

export default ResetPassword;
