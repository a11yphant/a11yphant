import clsx from "clsx";
import React from "react";

import CheckmarkAnimated from "../icons/CheckmarkAnimated";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  full?: boolean;
  icon?: React.ReactNode;
  srText?: string;
  overrideClassname?: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({ full = false, icon, srText, className, overrideClassname = false, children, ...props }) => {
  return (
    // <button
    //   className={`
    //   ${className}
    //   ${full ? "bg-primary text-white" : ""}
    //   ${
    //     !overrideClassname &&
    //     "border-primary border-2 rounded px-4 py-2 tracking-wider inline-flex items-center transition duration-300 hover:text-white hover:bg-primaryDark hover:border-primaryDark focus:text-white focus:bg-primaryDark focus:border-primaryDark"
    //   }`}
    //   {...props}
    // >
    //   {children}
    //   {icon}
    //   {srText && <span className="sr-only">{srText}</span>}
    // </button>
    <button
      className={clsx(
        "paragraph relative inline-flex px-6 py-4 transition-colors duration-300 items-center justify-center focus:outline-none",
        "cursor-not-allowed",
      )}
      v-bind="{ disabled: disabled || loading || success, type }"
      v-on="$listeners"
      // :className="{
      //   'cursor-not-allowed': this.disabled || this.loading || this.success,
      //   ...styles,
      // }"
    >
      <CheckmarkAnimated
        v-if="icon"
        //   :className="{ invisible: loading || success }"
        name="icon"
        className={clsx("mr-2")}
      />
      <span
        //   :className="{ invisible: loading || success }"
        className={clsx("group-hover:border-current border-b border-transparent whitespace-no-wrap")}
      >
        <slot />
      </span>
      <span v-if="loading || success" className="absolute inset-0 flex justify-center items-center">
        <CheckmarkAnimated name="success ? 'checkmark-animated' : 'spinner'" />
      </span>
    </button>
  );
};

export default Button;
