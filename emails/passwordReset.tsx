import { Html } from "@react-email/components";
import * as React from "react";

const PasswordReset: React.FunctionComponent = (props: { passwordResetLink: string }) => {
  return (
    <Html>
      <p>
        Hey there,
        <br /> a password reset has been requested for your account.
      </p>
      <p>To reset your password, please follow the link below. This link is valid for 24 hours.</p>

      <a href={props.passwordResetLink}>Reset your password</a>

      <p>
        Best regards,<br>The a11yphant team</br>
      </p>
    </Html>
  );
};

export default PasswordReset;
