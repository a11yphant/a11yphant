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
        editors={[
          { language: "html", code: htmlCode, updateCode: setHtmlCode },
          { language: "css", code: cssCode, updateCode: setCssCode },
          { language: "javascript", code: jsCode, updateCode: setJsCode },
        ]}
        width="50vw"
        height="90vh"
        theme="vs-dark"
      />
      <Preview htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
    </main>
  );
};

export default Challenge;
