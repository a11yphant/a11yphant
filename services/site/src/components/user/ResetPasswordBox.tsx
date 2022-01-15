import clsx from "clsx";

import ResetPasswordForm from "./ResetPasswordForm";
import UnderlinedTextButton from "./UnderlinedTextButton";
import { useUserAccountModalApi } from "./useUserAccountModalApi";

const ResetPasswordBox: React.FC = () => {
  const userAccountModalApi = useUserAccountModalApi();

  return (
    <>
      <ResetPasswordForm />
      <UnderlinedTextButton className={clsx("mt-8")} onClick={() => userAccountModalApi.show("signup")}>
        New here? Create a free account.
      </UnderlinedTextButton>
      <UnderlinedTextButton className={clsx("mt-4")} onClick={() => userAccountModalApi.show("login")}>
        Already have an account? Log in.
      </UnderlinedTextButton>
    </>
  );
};

export default ResetPasswordBox;
