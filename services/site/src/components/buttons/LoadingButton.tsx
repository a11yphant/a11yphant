import clsx from "clsx";
import React from "react";

import LoadingIndicator from "../icons/LoadingIndicator";
import Button, { ButtonProps } from "./Button";

export interface LoadingButtonProps extends ButtonProps {
  srTextLoading?: string;
  loading: boolean;
  submitButton?: boolean;
}

const LoadingButton: React.FunctionComponent<React.PropsWithChildren<LoadingButtonProps>> = ({
  srTextLoading,
  loading,
  submitButton = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      className={clsx(
        className,
        loading && "cursor-not-allowed",
        disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary",
        "font-medium",
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span className={clsx(loading && "invisible", "text-inherit")}>{children}</span>
      <span className={clsx("absolute inset-0 flex justify-center items-center", !loading && "hidden", submitButton && "pt-2 pl-2", "text-inherit")}>
        <LoadingIndicator />
      </span>
      {loading && <span className={clsx("sr-only")}>{srTextLoading}</span>}
    </Button>
  );
};

export default LoadingButton;
