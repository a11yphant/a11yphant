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
          <p className="m-0">Your e-mail could not be confirmed.</p>
          <LoadingButton
            className={clsx("h-10 ml-4 bg-white border-white text-primary", "hover:bg-primary hover:border-white hover:text-white")}
            loading={loading}
            onClick={handleClick}
          >
            Resend confirmation e-mail
          </LoadingButton>
        </>
      )}
      {resendConfirmationEmailResult && resendConfirmationEmailResult === ResendEmailConfirmationResultEnum.Successful && <p>Check your inbox</p>}
      {resendConfirmationEmailResult && resendConfirmationEmailResult !== ResendEmailConfirmationResultEnum.Successful && (
        <p>Your e-mail has already been verified</p>
      )}
    </div>
  );
};
