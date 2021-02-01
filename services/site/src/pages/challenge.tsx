import Editors from "app/components/challenge/Editors";
import React, { useState } from "react";

const Challenge = () => {
  const [htmlCode, setHtmlCode] = useState<string>(
    '<h1>The Device Vibration API </h1>\r\n\r\n<p> Today I learned about the device vibration API. This API allows you to control the vibration hardware of a phone from a website. There are some really good \r\n<span onlick="window.location =\r\nhttps://developer.mozilla.org/en-US/docs/Web/API/Vibration_API" class="link">vibration API examples in the MDN docs</span>.</p>',
  );
  const [cssCode, setCssCode] = useState<string>("");
  // const [jsCode, setJsCode] = useState<string>("");

  return (
    <main className="flex justify-between">
      <Editors
        editors={[
          { language: "html", code: htmlCode, updateCode: setHtmlCode, heading: "index.html" },
          { language: "css", code: cssCode, updateCode: setCssCode, heading: "index.css" },
          // { language: "javascript", code: jsCode, updateCode: setJsCode },
        ]}
        // width="50vw"
        // height="500px"
        theme="light"
        options={{ fontSize: 15 }}
      />
      {/* <Preview htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} /> */}
    </main>
  );
};

export default Challenge;
