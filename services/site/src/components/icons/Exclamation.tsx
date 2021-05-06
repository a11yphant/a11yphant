import clsx from "clsx";
import React from "react";

const Exclamation: React.FunctionComponent = () => (
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" className={clsx("h-6 w-6 text-primary")} aria-hidden="true" focusable="false">
    <path d="M10 32.16L22 12l12 20.16" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M21.515 26.162l-.76-4.992v-3.41h2.523v3.41l-.744 4.992h-1.02zM22 30.24c-.518 0-.89-.129-1.116-.387-.216-.258-.324-.574-.324-.949v-.422c0-.375.108-.691.324-.949.226-.258.598-.387 1.116-.387.518 0 .884.13 1.1.387.227.258.34.574.34.95v.421c0 .375-.113.692-.34.95-.216.257-.582.386-1.1.386z" />
  </svg>
);

export default Exclamation;
