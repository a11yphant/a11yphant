import LoadingButton from "app/components/buttons/LoadingButton";
import { ResendEmailConfirmationResultEnum, useResendConfirmationEmailMutation } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

export const EmailConfirmationFailedMessage = (): React.ReactElement => {
  const [resendConfirmationEmailResult, setResendConfirmationEmailResult] = React.useState<ResendEmailConfirmationResultEnum | null>(null);
  const [resendConfirmationEmail, { loading }] = useResendConfirmationEmailMutation();

  const handleClick = async (): Promise<void> => {
    const { data } = await resendConfirmationEmail();
    setResendConfirmationEmailResult(data.resendConfirmationEmail);
  };

  return (
    <div className={clsx("flex justify-center items-center")}>
      {resendConfirmationEmailResult === null && (
        <>
          <span className={clsx("not-sr-only", "mr-3 text-2xl")} aria-hidden={true}>
            ❌
          </span>
          Your email could not be confirmed
          <LoadingButton
            className={clsx("h-10 ml-4 bg-white border-white text-primary", "hover:bg-primary hover:border-white hover:text-white")}
            loading={loading}
            onClick={handleClick}
          >
            Resend Confirmation Email
          </LoadingButton>
        </>
      )}
      {resendConfirmationEmailResult && resendConfirmationEmailResult === ResendEmailConfirmationResultEnum.Successful && <div>Check your inbox</div>}
      {resendConfirmationEmailResult && resendConfirmationEmailResult !== ResendEmailConfirmationResultEnum.Successful && (
        <div>Your email has already been verified</div>
      )}
    </div>
  );
};
