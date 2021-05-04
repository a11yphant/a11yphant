import clsx from "clsx";
import { parse } from "node-html-parser";
import React, { useState } from "react";

interface PreviewProps {
  classes: string;
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

const Preview: React.FunctionComponent<PreviewProps> = ({ classes, cssCode, htmlCode, javascriptCode, heading }) => {
  const [innerHtmlCode, setInnerHtmlCode] = useState<string>("");
  const [innerCssCode, setInnerCssCode] = useState<string>("");
  const [innerJavascriptCode, setInnerJavascriptCode] = useState<string>("");

  const [renderCountdown, setRenderCountdown] = useState<NodeJS.Timeout>();
  const [forceUpdateState, setForceUpdateState] = useState<boolean>();

  const startRenderCountdown = (): NodeJS.Timeout =>
    setTimeout(() => {
      setInnerHtmlCode(addTargetBlank(htmlCode));
      setInnerCssCode(addBaseFont(cssCode));
      setInnerJavascriptCode(javascriptCode);
    }, 1000);

  React.useEffect(() => {
    if (renderCountdown) {
      clearTimeout(renderCountdown);
    }

    setRenderCountdown(startRenderCountdown());
  }, [htmlCode, cssCode, javascriptCode]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const forceUpdate = React.useCallback(() => setForceUpdateState((prev) => !prev), []);

  return (
    <div className={clsx("p-4", "container-light", classes)}>
      <h3 className={clsx("text-primary font-normal mb-2", "h6")}>{heading}</h3>
      <iframe
        title="Preview"
        className="w-full h-18/20 pb-8"
        srcDoc={`<style>${innerCssCode}</style><meta name="forceUpdate" content="${forceUpdateState}"><base target="_blank">${innerHtmlCode}<script>${innerJavascriptCode}</script>`}
      />
    </div>
  );
};

export default Preview;
