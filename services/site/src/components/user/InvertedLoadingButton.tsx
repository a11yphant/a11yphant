import clsx from "clsx";
import React from "react";

import LoadingIndicator from "../icons/LoadingIndicator";

const InvertedLoadingButton: React.FC<{ loading: boolean; srLoadingText: string }> = ({ loading, srLoadingText, children }) => {
  return (
    <button
      className={clsx(
        "px-8 py-4 mb-2 block w-full text-center align-middle text-primary bg-light font-medium leading-none rounded border border-light",
        "transition duration-300 group",
        "hover:bg-primary hover:text-light",
        "focus:bg-primary focus:text-light",
        loading && "cursor-wait",
      )}
      type="submit"
      disabled={loading}
    >
      {!loading && children}
      {loading && (
        <>
          <LoadingIndicator className="inline" />
          <span className="sr-only">{srLoadingText}</span>
        </>
      )}
    </button>
  );
};

export default InvertedLoadingButton;
