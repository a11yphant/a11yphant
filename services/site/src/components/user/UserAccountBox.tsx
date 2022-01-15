import React from "react";

import LoginBox from "./LoginBox";
import ResetPasswordBox from "./ResetPasswordBox";
import SignUpBox from "./SignUpBox";
import { UserAccountModalTypes } from "./useUserAccountModalApi";

export interface UserAccountBoxProps {
  mode: UserAccountModalTypes;
}

export const UserAccountBox = ({ mode }: UserAccountBoxProps): React.ReactElement => (
  <>
    {mode === "signup" && <SignUpBox />}
    {mode === "login" && <LoginBox />}
    {mode === "reset-password" && <ResetPasswordBox />}
  </>
);
