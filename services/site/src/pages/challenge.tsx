import Editors from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import SideBar from "app/components/challenge/SideBar";
import React, { useState } from "react";

const Challenge = () => {
  const [htmlCode, setHtmlCode] = useState<string>(
    '<h1>The Device Vibration API </h1>\r\n\r\n<p> Today I learned about the device vibration API. This API allows you to control the vibration hardware of a phone from a website. There are some really good \r\n<span onlick="window.location =\r\nhttps://developer.mozilla.org/en-US/docs/Web/API/Vibration_API" class="link">vibration API examples in the MDN docs</span>.</p>',
  );
  const [cssCode, setCssCode] = useState<string>(
    "html, body {\r\n  font-family: Arial, sans-serif;\r\n  font-size: 1.2rem;\r\n  line-height: 1.6rem;\r\n  letter-spacing: 0.02rem;\r\n  max-width: 80ch;\r\n}\r\n\r\n.link {\r\n  color: black;\r\n  text-decoration: none;\r\n  border-bottom: 3px solid blue;\r\n}\r\n\r\n.link:hover, .link:active, .link:focus {\r\n  color: blue;\r\n  border-color: blue;\r\n  cursor: pointer;\r\n  border-width: 0px;\r\n}",
  );
  const [jsCode, setJsCode] = useState<string>("");

  return (
    <main className="flex justify-between flex-col">
      <SideBar
        instructions={{
          text: [
            "Your friend Charles spent the last few weeks building a new website for his tech blog. But since he launched it, he keeps getting emails from frustrated readers reporting that they can’t access any links using their keyboard or screen readers.",
            "Charles hasn’t been able to figure out the problem himself. Therefore, he asked you for help in this matter. He sent you a code snippet from his website, that you can find in the editor to the right.",
          ],
          tldr:
            "TL; DR: Refactor the given code so that the link is navigable using input devices other than a mouse (e.g. keyboard or screen reader)",
          requirements: [
            "The link can be activated using the mouse.",
            "The link can be focused using the keyboard.",
            "The link can be activated using the keyboard.",
            "The link can be detected as a link by screen readers.",
          ],
        }}
      />
      <Editors
        editors={[
          { language: "html", code: htmlCode, updateCode: setHtmlCode, heading: "index.html" },
          { language: "css", code: cssCode, updateCode: setCssCode, heading: "index.css" },
          { language: "javascript", code: jsCode, updateCode: setJsCode, heading: "index.js" },
        ]}
        // width="50vw"
        // height="500px"
        theme="light"
        options={{ fontSize: 15 }}
      />
      <Preview htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
    </main>
  );
};

export default Challenge;
