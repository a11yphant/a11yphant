import Editor from "app/components/challenge/Editor";
import Preview from "app/components/challenge/Preview";
import React, { useState } from "react";

const Challenge = () => {
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [jsCode, setJsCode] = useState<string>("");

  return (
    <main className="flex justify-between">
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
        activeEditors={{
          html: true,
          css: true,
          js: true,
        }}
      />
      <Preview htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
    </main>
  );
};

export default Challenge;
