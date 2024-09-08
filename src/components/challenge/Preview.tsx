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

const getTitle = (html: string): string | null => {
  const dom = parse(html);
  return dom.querySelector("title")?.innerText;
};

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
  const [title, setTitle] = useState<string | null>(null);

  React.useEffect(() => {
    setPreviewUpdated(false);
    debouncedUpdate(() => {
      setTitle(getTitle(htmlCode));
      setInnerHtmlCode(addTargetBlank(htmlCode));
      setInnerCssCode(addBaseFont(cssCode));
      setInnerJavascriptCode(javascriptCode);
      setPreviewUpdated(true);
    });
  }, [htmlCode, cssCode, javascriptCode]);

  return (
    <section className={clsx("px-4 py-3 sm:p-4", "container-light overflow-hidden", className)} aria-label="Preview">
      <h3 className={clsx("text-primary font-normal mb-2", "h6")}>
        {heading}
        {title && (
          <>
            : <span className="sr-only">Title: </span>
            <span className={clsx("text-black")}>{title}</span>
          </>
        )}
        {!previewUpdated && (
          <span className={clsx("text-current")}>
            <span className={clsx("sr-only")}>Updating the live preview is in progress...</span>
            <LoadingIndicator className={clsx("inline-block ml-2 mb-0.5")} />
          </span>
        )}
      </h3>
      <iframe
        title="Preview of the code in the editor"
        className={clsx("w-full h-[90%] pb-8")}
        srcDoc={`<style>${innerCssCode}</style><base target="_blank">${innerHtmlCode}<script>${innerJavascriptCode}</script>`}
      />
    </section>
  );
};

export default Preview;
