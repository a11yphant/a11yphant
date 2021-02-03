import Editors from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import SideBar from "app/components/challenge/SideBar";
import React, { useState } from "react";

const Challenge = () => {
  const [htmlCode, setHtmlCode] = useState<string>(
    '<h1>The Device Vibration API </h1>\r\n\r\n<p> Today I learned about the device vibration API. This API allows you to control the vibration hardware of a phone from a website. There are some really good \r\n<span onlick="window.location =\r\nhttps://developer.mozilla.org/en-US/docs/Web/API/Vibration_API" class="link">vibration API examples in the MDN docs</span>.</p>',
  );
  const [cssCode, setCssCode] = useState<string>(
    "html, body {\r\n  font-family: Arial, sans-serif;\r\n  font-size: 1rem;\r\n  line-height: 1.6rem;\r\n  letter-spacing: 0.02rem;\r\n  max-width: 80ch;\r\n}\r\n\r\n.link {\r\n  color: black;\r\n  text-decoration: none;\r\n  border-bottom: 3px solid blue;\r\n}\r\n\r\n.link:hover, .link:active, .link:focus {\r\n  color: blue;\r\n  border-color: blue;\r\n  cursor: pointer;\r\n  border-width: 0px;\r\n}",
  );
  const [jsCode, setJsCode] = useState<string>("");

  return (
    <div className="w-screen h-screen">
      {/*@Todo: Add header*/}
      <main className="flex justify-between h-full box-border p-4">
        <SideBar
          classes="h-full"
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
          hints={{
            num: 3,
          }}
          resources={[
            {
              label: "Creating valid and accessible links",
              link: "https://www.a11yproject.com/posts/2019-02-15-creating-valid-and-accessible-links/",
            },
            {
              label: "Setting up a screen reader in Google Chrome",
              link: "https://chrome.google.com/webstore/detail/screen-reader/kgejglhpjiefppelpmljglcjbhoiplfn?hl=de",
            },
          ]}
        />
        <div className="flex justify-between flex-col flex-auto h-full box-border pl-4">
          <Editors
            classes="w-full h-3/5"
            editors={[
              { language: "html", code: htmlCode, updateCode: setHtmlCode, heading: "index.html" },
              { language: "css", code: cssCode, updateCode: setCssCode, heading: "index.css" },
              { language: "javascript", code: jsCode, updateCode: setJsCode, heading: "index.js" },
            ]}
            theme="light"
            options={{
              fontSize: 12,
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
            }}
          />
          <Preview classes="w-full h-2/5" htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
        </div>
      </main>
    </div>
  );
};

export default Challenge;
