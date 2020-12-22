import React from "react";

interface PreviewProps {
  cssCode: string;
  htmlCode: string;
  jsCode: string;
}

const Preview: React.FunctionComponent<PreviewProps> = ({ cssCode, htmlCode, jsCode }) => {
  return <iframe className="border-8 w-1/2" srcDoc={`<style>${cssCode}</style>${htmlCode}<script>${jsCode}</script>`} />;
};

export default Preview;
