import clsx from "clsx";
import debounce from "lodash.debounce";
import { parse } from "node-html-parser";
import React, { useState } from "react";

import LoadingIndicator from "../icons/LoadingIndicator";

interface PreviewProps {
  className?: string;
  cssCode: string;
  htmlCode: string;
  javascriptCode: string;
  heading: string;
}

//@TODO: Remove once base element support is better (https://caniuse.com/mdn-html_elements_base)
const addTargetBlank = (html: string): string => {
  const dom = parse(html);

  dom.querySelectorAll("a").forEach((anchor) => {
    anchor.setAttribute("target", "_blank");
  });

  return dom.toString();
};

const addBaseFont = (css: string): string => {
  const font = `body {
    font-family: "Courier", "Arial", sans-serif;
  }`;

  return font + css;
};

const debouncedUpdate = debounce((update: () => void) => {
  update();
}, 1000);

const Preview: React.FunctionComponent<PreviewProps> = ({ className, cssCode, htmlCode, javascriptCode, heading }) => {
  const [innerHtmlCode, setInnerHtmlCode] = useState<string>("");
  const [innerCssCode, setInnerCssCode] = useState<string>("");
  const [innerJavascriptCode, setInnerJavascriptCode] = useState<string>("");
  const [previewUpdated, setPreviewUpdated] = useState<boolean>(true);

  React.useEffect(() => {
    setPreviewUpdated(false);
    debouncedUpdate(() => {
      setInnerHtmlCode(addTargetBlank(htmlCode));
      setInnerCssCode(addBaseFont(cssCode));
      setInnerJavascriptCode(javascriptCode);
      setPreviewUpdated(true);
    });
  }, [htmlCode, cssCode, javascriptCode]);

  return (
    <div className={clsx("p-4", "container-light overflow-hidden", className)}>
      <h3 className={clsx("text-primary font-normal mb-2", "h6")}>
        {heading}{" "}
        {!previewUpdated && (
          <span className="text-current">
            <span className="sr-only">Updating the live preview is in progress...</span>
            <LoadingIndicator className="inline-block ml-2 mb-0.5" />
          </span>
        )}
      </h3>
      <iframe
        title="Preview"
        className="w-full h-preview pb-8"
        tabIndex={-1}
        srcDoc={`<style>${innerCssCode}</style><base target="_blank">${innerHtmlCode}<script>${innerJavascriptCode}</script>`}
      />
    </div>
  );
};

export default Preview;
