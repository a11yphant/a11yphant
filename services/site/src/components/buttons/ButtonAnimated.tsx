import clsx from "clsx";
import React from "react";

import LoadingIndicator from "../icons/LoadingIndicator";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  full?: boolean;
  srText?: string;
  overrideClassname?: boolean;
  loading: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  full = false,
  srText,
  className,
  overrideClassname = false,
  children,
  disabled,
  loading,
  ...props
}) => {
  return (
    <button
      className={clsx(
        className,
        full ? "bg-primary text-white" : "",
        !overrideClassname &&
          "inline-flex items-center px-4 py-2 border-primary border-2 rounded tracking-wider transition duration-300 hover:text-white hover:bg-primaryDark hover:border-primaryDark focus:text-white focus:bg-primaryDark focus:border-primaryDark",
        disabled || loading ? "cursor-not-allowed" : "",
      )}
      disabled={disabled || loading}
      {...props}
    >
      {srText && <span className="sr-only">{srText}</span>}
      <span className={clsx(loading ? "invisible" : "")}>{children}</span>
      <span className={clsx("absolute inset-0 pt-2 pl-2 flex justify-center items-center", loading ? "" : "hidden")}>
        <LoadingIndicator />
      </span>
    </button>
  );
};

export default Button;
