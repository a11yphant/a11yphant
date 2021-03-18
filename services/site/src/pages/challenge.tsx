import Button from "app/components/buttons/Button";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import Navigation from "app/components/Navigation";
import React, { useState } from "react";

export interface Code {
  html: string;
  css: string;
  javascript: string;
}

const code: Code = {
  html:
    '<h1>The Device Vibration API </h1>\r\n\r\n<p> Today I learned about the device vibration API. This API allows you to control the vibration hardware of a phone from a website. There are some really good \r\n<span onlick="window.location =\r\nhttps://developer.mozilla.org/en-US/docs/Web/API/Vibration_API" class="link">vibration API examples in the MDN docs</span>.</p>',
  css:
    "html, body {\r\n  font-family: Arial, sans-serif;\r\n  font-size: 1rem;\r\n  line-height: 1.6rem;\r\n  letter-spacing: 0.02rem;\r\n  max-width: 80ch;\r\n}\r\n\r\n.link {\r\n  color: black;\r\n  text-decoration: none;\r\n  border-bottom: 3px solid blue;\r\n}\r\n\r\n.link:hover, .link:active, .link:focus {\r\n  color: blue;\r\n  border-color: blue;\r\n  cursor: pointer;\r\n  border-width: 0px;\r\n}",
  javascript: "",
};

const Challenge: React.FunctionComponent = () => {
  const [currHtmlCode, setCurrHtmlCode] = useState<string>();
  const [currCssCode, setCurrCssCode] = useState<string>();
  const [currJavascriptCode, setCurrJavascriptCode] = useState<string>();

  const [initialCode, setInitialCode] = useState<Code>();

  const resetToInitialCode = (language?: EditorLanguage): void => {
    // if language === undefined => reset all
    const newCode: Code = {
      html: !language ? initialCode.html : currHtmlCode,
      css: !language ? initialCode.css : currCssCode,
      javascript: !language ? initialCode.javascript : currJavascriptCode,
    };

    if (language) {
      newCode[language] = initialCode[language];
    }

    setCurrHtmlCode(newCode.html);
    setCurrCssCode(newCode.css);
    setCurrJavascriptCode(newCode.javascript);
  };

  React.useEffect(() => {
    setInitialCode(code);

    setCurrHtmlCode(code.html);
    setCurrCssCode(code.css);
    setCurrJavascriptCode(code.javascript);
  }, []);

  return (
    <div className="w-screen h-screen">
      <Navigation challengeName="Accessible Links" currentLevel="01" maxLevel="03" />
      <main className="flex justify-between h-19/20 box-border p-4">
        <Sidebar
          classes="h-full"
          instructions={{
            text: [
              "Your friend Charles spent the last few weeks building a new website for his tech blog. But since he launched it, he keeps getting emails from frustrated readers reporting that they can’t access any links using their keyboard or screen readers.",
              "Charles hasn’t been able to figure out the problem himself. Therefore, he asked you for help in this matter. He sent you a code snippet from his website, that you can find in the editor to the right.",
            ],
            tldr:
              "TL; DR: Refactor the given code so that the link is navigable using input devices other than a mouse (e.g. keyboard or screen reader)",
            requirements: [
              {
                id: "a",
                title: "The link can be activated using the mouse.",
              },
              {
                id: "b",
                title: "The link can be focused using the keyboard.",
              },
              {
                id: "c",
                title: "The link can be activated using the keyboard.",
              },
              {
                id: "d",
                title: "The link can be detected as a link by screen readers.",
              },
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
        <div className="flex justify-between flex-col flex-auto h-full box-border pl-4 relative">
          <Editors
            reset={resetToInitialCode}
            classes="w-full h-3/5"
            editors={[
              { languageLabel: "HTML", language: EditorLanguage.html, code: currHtmlCode, updateCode: setCurrHtmlCode, heading: "index.html" },
              { languageLabel: "CSS", language: EditorLanguage.css, code: currCssCode, updateCode: setCurrCssCode, heading: "index.css" },
              {
                languageLabel: "JavaScript",
                language: EditorLanguage.javascript,
                code: currJavascriptCode,
                updateCode: setCurrJavascriptCode,
                heading: "index.js",
              },
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
          <Preview classes="w-full h-2/5" heading="Preview" htmlCode={currHtmlCode} cssCode={currCssCode} javascriptCode={currJavascriptCode} />
          <div className="absolute right-0 bottom-0 pt-4 pl-4 pr-2 pb-2 bg-white border-primary border-t-2 border-l-2 rounded-tl-lg">
            <Button
              full
              onClick={() => {
                alert("Thank you Mario, but our princess is in another castle!");
              }}
              classes="px-10 tracking-wider"
            >
              Submit
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Challenge;
