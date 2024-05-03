import clsx from "clsx";
import React from "react";

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  primary?: boolean;
  icon?: React.ReactNode;
  srText?: string;
  innerRef?: React.MutableRefObject<HTMLButtonElement>;
  overrideClassName?: boolean;
  animation?: boolean;
}

const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = ({
  primary = false,
  icon,
  srText,
  innerRef,
  overrideClassName = false,
  className,
  children,
  disabled,
  animation,
  ...props
}) => {
  return (
    <button
      className={clsx(
        className,
        disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary",
        primary && "bg-primary text-light",
        "font-medium",
        animation &&
          "z-10 px-3 py-2 border-2 border-solid border-light rounded-md bg-background h-fit-content self-end hover:bg-light hover:text-background transition duration-300",
        !overrideClassName &&
          `relative inline-flex items-center px-4 xl:px-6 py-2.5
          border-primary border-2 rounded tracking-wider transition duration-300
          hover:text-light hover:bg-primary-dark hover:border-primary-dark`,
      )}
      ref={innerRef}
      disabled={disabled}
      {...props}
    >
      {children}
      {srText && <span className={clsx("sr-only")}>{srText}</span>}
    </button>
  );
};

export default Button;
