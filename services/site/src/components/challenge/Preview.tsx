import Button from "app/components/buttons/Button";
import Trash from "app/components/icons/Trash";
import debounce from "lodash.debounce";
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

const debouncedUpdate = debounce((update: () => void) => {
  update();
}, 1000);

const Preview: React.FunctionComponent<PreviewProps> = ({ classes, cssCode, htmlCode, javascriptCode, heading }) => {
  const [innerHtmlCode, setInnerHtmlCode] = useState<string>("");
  const [innerCssCode, setInnerCssCode] = useState<string>("");
  const [innerJavascriptCode, setInnerJavascriptCode] = useState<string>("");

  const [forceUpdateState, setForceUpdateState] = useState<boolean>();

  React.useEffect(() => {
    debouncedUpdate(() => {
      setInnerHtmlCode(addTargetBlank(htmlCode));
      setInnerCssCode(cssCode);
      setInnerJavascriptCode(javascriptCode);
    });
  }, [htmlCode, cssCode, javascriptCode]);

  const forceUpdate = React.useCallback(() => setForceUpdateState((prev) => !prev), []);

  return (
    <div className={`${classes} box-border relative border-2 rounded-lg border-primary py-2 px-4 overflow-hidden`}>
      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="text-primary">{heading}</h3>
        <Button
          onClick={() => {
            forceUpdate();
          }}
          className="flex items-center tracking-wide text-primary font-bold group hover:text-primaryDark group-hover:text-primaryDark"
          overrideClassname
        >
          <Trash />
          Reset
        </Button>
      </div>
      <iframe
        title="Preview"
        className="w-full h-18/20 pb-8"
        srcDoc={`<style>${innerCssCode}</style><meta name="forceUpdate" content="${forceUpdateState}"><base target="_blank">${innerHtmlCode}<script>${innerJavascriptCode}</script>`}
      />
    </div>
  );
};

export default Preview;
