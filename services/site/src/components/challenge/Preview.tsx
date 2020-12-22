import React from "react";

interface PreviewProps {
  cssCode: string;
  htmlCode: string;
  jsCode: string;
}

const Preview: React.FunctionComponent<PreviewProps> = ({ cssCode, htmlCode, jsCode }) => {
  return <iframe srcDoc={`<style>${cssCode}</style>${htmlCode}<script>${jsCode}</script>`} />;
};

export default Preview;
