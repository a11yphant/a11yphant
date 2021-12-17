import React from "react";

import LoginBox from "./LoginBox";
import SignUpBox from "./SignUpBox";

export interface UserAccountBoxProps {
  mode: "signup" | "login";
}

export const UserAccountBox = ({ mode }: UserAccountBoxProps): React.ReactElement => (
  <>
    {mode === "signup" && <SignUpBox />}
    {mode === "login" && <LoginBox />}
  </>
);
