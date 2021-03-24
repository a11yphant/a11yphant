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

const Preview: React.FunctionComponent<PreviewProps> = ({ classes, cssCode, htmlCode, javascriptCode, heading }) => {
  const [innerHtmlCode, setInnerHtmlCode] = useState<string>("");
  const [innerCssCode, setInnerCssCode] = useState<string>("");
  const [innerJavascriptCode, setInnerJavascriptCode] = useState<string>("");

  const [renderCountdown, setRenderCountdown] = useState<NodeJS.Timeout>();

  const startRenderCountdown = (): NodeJS.Timeout =>
    setTimeout(() => {
      setInnerHtmlCode(addTargetBlank(htmlCode));
      setInnerCssCode(cssCode);
      setInnerJavascriptCode(javascriptCode);
    }, 1000);

  React.useEffect(() => {
    if (renderCountdown) {
      clearTimeout(renderCountdown);
    }

    setRenderCountdown(startRenderCountdown());
  }, [htmlCode, cssCode, javascriptCode]);

  return (
    <div className={`${classes} box-border relative border-2 rounded-lg border-primary py-2 px-4 overflow-hidden`}>
      <h3 className="text-primary mb-4">{heading}</h3>
      <iframe
        title="Preview"
        className="w-full h-18/20 pb-8"
        srcDoc={`<style>${innerCssCode}</style><base target="_blank">${innerHtmlCode}<script>${innerJavascriptCode}</script>`}
      />
    </div>
  );
};

export default Preview;
