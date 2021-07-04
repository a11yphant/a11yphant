import React from "react";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  full?: boolean;
  srText?: string;
  innerRef?: React.MutableRefObject<HTMLButtonElement>;
  overrideClassname?: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  full = false,
  srText,
  className,
  overrideClassname = false,
  children,
  innerRef,
  ...props
}) => {
  return (
    <button
      className={`
      ${className}
      ${full ? "bg-primary text-white" : ""} 
      ${
        !overrideClassname &&
        "border-primary border-2 rounded px-4 py-2 tracking-wider inline-flex items-center transition duration-300 hover:text-white hover:bg-primaryDark hover:border-primaryDark focus:text-white focus:bg-primaryDark focus:border-primaryDark"
      }`}
      ref={innerRef}
      {...props}
    >
      {children}
      {srText && <span className="sr-only">{srText}</span>}
    </button>
  );
};

export default Button;
