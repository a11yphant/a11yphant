import React, { useState } from "react";

interface PreviewProps {
  classes: string;
  cssCode: string;
  htmlCode: string;
  javascriptCode: string;
}

const Preview: React.FunctionComponent<PreviewProps> = ({ classes, cssCode, htmlCode, javascriptCode }) => {
  const [innerHtmlCode, setInnerHtmlCode] = useState<string>("");
  const [innerCssCode, setInnerCssCode] = useState<string>("");
  const [innerJavascriptCode, setInnerJavascriptCode] = useState<string>("");

  const [renderCountdown, setRenderCountdown] = useState<NodeJS.Timeout>();

  React.useEffect(() => {
    const startRenderCountdown = (): NodeJS.Timeout =>
      setTimeout(() => {
        setInnerHtmlCode(htmlCode);
        setInnerCssCode(cssCode);
        setInnerJavascriptCode(javascriptCode);
      }, 1000);

    if (renderCountdown) {
      clearTimeout(renderCountdown);
    }

    setRenderCountdown(startRenderCountdown());
  }, [htmlCode, cssCode, javascriptCode, renderCountdown]);

  return (
    <iframe
      className={`${classes} border-2 rounded-lg border-primary py-2 px-4 box-border`}
      srcDoc={`<style>${innerCssCode}</style>${innerHtmlCode}<script>${innerJavascriptCode}</script>`}
    />
  );
};

export default Preview;
