import _ from "lodash";
import React, { useCallback, useState } from "react";

interface PreviewProps {
  cssCode: string;
  htmlCode: string;
  jsCode: string;
}

const Preview: React.FunctionComponent<PreviewProps> = ({ cssCode, htmlCode, jsCode }) => {
  const [innerHtmlCode, setInnerHtmlCode] = useState<string>("");
  const [innerCssCode, setInnerCssCode] = useState<string>();
  const [innerJsCode, setInnerJsCode] = useState<string>();

  const updateCode = useCallback(
    _.throttle(() => setInnerHtmlCode(htmlCode), 2000),
    [htmlCode],
  );

  React.useEffect(() => {
    console.log("htmlCode", htmlCode);

    updateCode();
  }, [htmlCode, cssCode, jsCode]);

  React.useEffect(() => {
    console.log("innerHtmlCode", innerHtmlCode);
  }, [innerHtmlCode]);

  return <iframe className="border-8 w-1/2" srcDoc={`<style>${cssCode}</style>${innerHtmlCode}<script>${jsCode}</script>`} />;
};

export default Preview;
