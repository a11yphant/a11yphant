import clsx from "clsx";
import React from "react";

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  primary?: boolean;
  icon?: React.ReactNode;
  srText?: string;
  innerRef?: React.MutableRefObject<HTMLButtonElement>;
  overrideClassName?: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  primary = false,
  icon,
  srText,
  innerRef,
  overrideClassName = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        className,
        disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary",
        primary && "bg-primary text-light",
        !overrideClassName &&
          "inline-flex items-center px-4 py-2 border-primary border-2 rounded tracking-wider transition duration-300 hover:text-light hover:bg-primary-dark hover:border-primary-dark focus:text-light focus:bg-primary-dark focus:border-primary-dark",
      )}
      ref={innerRef}
      disabled={disabled}
      {...props}
    >
      {children}
      {srText && <span className="sr-only">{srText}</span>}
    </button>
  );
};

export default Button;
