import clsx from "clsx";
import React from "react";

import LoadingIndicator from "../icons/LoadingIndicator";
import Button from "./Button";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  full?: boolean;
  icon?: React.ReactNode;
  srText?: string;
  overrideClassname?: boolean;
  loading: boolean;
  submitButton?: boolean;
}

const ButtonLoading: React.FunctionComponent<ButtonProps> = ({
  full,
  icon,
  srText,
  className,
  overrideClassname,
  disabled,
  loading,
  submitButton,
  children,
  ...props
}) => {
  return (
    <Button
      full={full}
      overrideClassname={overrideClassname}
      className={clsx(className, (disabled || loading) && "cursor-not-allowed")}
      disabled={disabled || loading}
      {...props}
      srText={srText}
      icon={icon}
    >
      <span className={clsx(loading && "invisible")}>{children}</span>
      <span className={clsx("absolute inset-0 flex justify-center items-center", !loading && "hidden", submitButton && "submit-button")}>
        <LoadingIndicator />
      </span>
      {loading && <span className="sr-only">The submission is being processed.</span>}
    </Button>
  );
};

export default ButtonLoading;
