import Button from "app/components/buttons/Button";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import Navigation from "app/components/Navigation";
import { ChallengeDocument, Code, useChallengeQuery } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import React, { useState } from "react";

const challengeId = "242003d6-402e-49b7-9ec2-702445b37c8e";

const Challenge: React.FunctionComponent = () => {
  const { loading, data } = useChallengeQuery({ variables: { id: challengeId } });
  const level1 = data?.challenge?.levels[0];

  const [initialCode] = useState<Code>(level1.code);

  const [currHtmlCode, setCurrHtmlCode] = useState<string>(level1?.code?.html);
  const [currCssCode, setCurrCssCode] = useState<string>(level1?.code?.css);
  const [currJavascriptCode, setCurrJavascriptCode] = useState<string>(level1?.code?.js);

  const resetToInitialCode = (language?: EditorLanguage): void => {
    // if language === undefined => reset all
    const newCode: Code = !language
      ? initialCode
      : {
          html: currHtmlCode,
          css: currCssCode,
          js: currJavascriptCode,
        };

    if (language) {
      newCode[language] = initialCode[language];
    }

    setCurrHtmlCode(newCode.html);
    setCurrCssCode(newCode.css);
    setCurrJavascriptCode(newCode.js);
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="w-screen h-screen">
      <Navigation challengeName="Accessible Links" currentLevel="01" maxLevel="03" />
      <main className="flex justify-between h-19/20 box-border p-4">
        <Sidebar
          classes="h-full"
          instructions={{
            instructions: level1.instructions,
            tldr: level1.tldr,
            requirements: level1.requirements,
          }}
          hints={level1.hints}
          resources={level1.resources}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ChallengeDocument,
    variables: {
      id: challengeId,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
