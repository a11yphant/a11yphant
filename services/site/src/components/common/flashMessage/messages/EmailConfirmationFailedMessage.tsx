import LoadingButton from "app/components/buttons/LoadingButton";
import { useResendConfirmationEmailMutation } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

export const EmailConfirmationFailedMessage = (): React.ReactElement => {
  const [resent, setResent] = React.useState<boolean>(false);
  const [resendConfirmationEmail, { loading }] = useResendConfirmationEmailMutation();

  const handleClick = async (): Promise<void> => {
    await resendConfirmationEmail();
    setResent(true);
  };

  return (
    <div className={clsx("flex justify-center items-center")}>
      {!resent ? (
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
      ) : (
        <div>Check your inbox</div>
      )}
    </div>
  );
};
