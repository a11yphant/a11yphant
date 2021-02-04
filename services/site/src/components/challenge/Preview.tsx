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

  const startRenderCountdown = () =>
    setTimeout(() => {
      setInnerHtmlCode(htmlCode);
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
    <iframe
      className={`${classes} border-2 rounded-lg border-primary py-2 px-4 box-border`}
      srcDoc={`<style>${innerCssCode}</style>${innerHtmlCode}<script>${innerJavascriptCode}</script>`}
    />
  );
};

export default Preview;
