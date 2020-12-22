import Editor from "app/components/challenge/Editor";
import Preview from "app/components/challenge/Preview";
import React, { useState } from "react";

const Challenge = () => {
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [jsCode, setJsCode] = useState<string>("");

  return (
    <div>
      <Editor
        htmlCode={htmlCode}
        setHtmlCode={setHtmlCode}
        cssCode={cssCode}
        setCssCode={setCssCode}
        jsCode={jsCode}
        setJsCode={setJsCode}
        width="50vw"
        height="90vh"
        theme="dark"
      />
      <Preview htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
    </div>
  );
};

export default Challenge;
