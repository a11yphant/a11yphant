import React from "react";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  full?: boolean;
  icon?: React.ReactNode;
  srText?: string;
  overrideClassname?: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({ full = false, icon, srText, className, overrideClassname = false, children, ...props }) => {
  return (
    <button
      className={`
      ${className}
      ${full ? "bg-primary text-white" : ""} 
      ${
        !overrideClassname &&
        "border-primary border-2 rounded px-4 py-2 tracking-wider inline-flex items-center transition duration-300 hover:text-white hover:bg-primaryDark hover:border-primaryDark focus:text-white focus:bg-primaryDark focus:border-primaryDark"
      }`}
      {...props}
    >
      {children}
      {icon}
      {srText && <span className="sr-only">{srText}</span>}
    </button>
  );
};

export default Button;
