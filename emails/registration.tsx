import { Html } from "@react-email/components";
import * as React from "react";

const Registration: React.FunctionComponent<{ confirmationLink: string; displayName: string }> = (props) => {
  return (
    <Html>
      <h1>Welcome to a11yphant!</h1>
      <p>
        Hello <b>{props.displayName}</b>, click the link below to confirm your address:
      </p>
      <p>
        <a href={props.confirmationLink}>Confirm</a> - This link is valid for 24 hours.
      </p>
      <p>Cheers!</p>
    </Html>
  );
};

export default Registration;
