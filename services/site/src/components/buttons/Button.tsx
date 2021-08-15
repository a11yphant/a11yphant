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
  className,
  overrideClassName = false,
  children,
  innerRef,
  ...props
}) => {
  return (
    <button
      className={clsx(
        className,
        primary && "bg-primary text-white",
        !overrideClassName &&
          "inline-flex items-center px-4 py-2 border-primary border-2 rounded tracking-wider transition duration-300 hover:text-white hover:bg-primary-dark hover:border-primary-dark focus:text-white focus:bg-primary-dark focus:border-primary-dark",
      )}
      ref={innerRef}
      {...props}
    >
      {children}
      {srText && <span className="sr-only">{srText}</span>}
    </button>
  );
};

export default Button;
