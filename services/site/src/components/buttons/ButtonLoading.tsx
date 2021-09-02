import clsx from "clsx";
import React from "react";

import LoadingIndicator from "../icons/LoadingIndicator";
import Button, { ButtonProps } from "./Button";

interface ButtonLoadingProps extends ButtonProps {
  srTextLoading?: string;
  loading: boolean;
  submitButton?: boolean;
}

const ButtonLoading: React.FunctionComponent<ButtonLoadingProps> = ({
  srTextLoading,
  loading,
  submitButton = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button className={clsx(className, (disabled || loading) && "cursor-not-allowed")} disabled={disabled || loading} {...props}>
      <span className={clsx(loading && "invisible")}>{children}</span>
      <span className={clsx("absolute inset-0 flex justify-center items-center", !loading && "hidden", submitButton && "pt-2 pl-2")}>
        <LoadingIndicator />
      </span>
      {loading && <span className="sr-only">{srTextLoading}</span>}
    </Button>
  );
};

export default ButtonLoading;
