import clsx from "clsx";

import { useFlashMessageApi } from "../common/flashMessage/FlashMessageContext";
import RequestPasswordResetForm from "./RequestPasswordResetForm";
import UnderlinedTextButton from "./UnderlinedTextButton";
import { useUserAccountModalApi } from "./useUserAccountModalApi";

const RequestPasswordResetBox: React.VFC = () => {
  const userAccountModalApi = useUserAccountModalApi();
  const flashMessageApi = useFlashMessageApi();

  function afterFormSubmit(): void {
    flashMessageApi.show("We sent you an email with a link to reset your password. If you don't see the email, please check your spam folder.");
    userAccountModalApi.hide();
  }

  return (
    <>
      <RequestPasswordResetForm onAfterSubmit={afterFormSubmit} />
      <UnderlinedTextButton className={clsx("mt-8")} onClick={() => userAccountModalApi.show("signup")}>
        New here? Create a free account.
      </UnderlinedTextButton>
      <UnderlinedTextButton className={clsx("mt-4")} onClick={() => userAccountModalApi.show("login")}>
        Already have an account? Log in.
      </UnderlinedTextButton>
    </>
  );
};

export default RequestPasswordResetBox;
