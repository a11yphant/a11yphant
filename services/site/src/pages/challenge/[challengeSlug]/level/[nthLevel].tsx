import Button from "app/components/buttons/Button";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import Navigation from "app/components/Navigation";
import {
  Code,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQueryResult,
  LevelByChallengeSlugQueryVariables,
  useLevelByChallengeSlugQuery,
} from "app/generated/graphql";
import { initializeApollo } from "app/lib/apolloClient";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useSubmitMutation } from "../../../../generated/graphql";

const Level: React.FunctionComponent = () => {
  const router = useRouter();
  const { challengeSlug, nthLevel } = router.query;

  const {
    loading,
    data: { level },
  } = useLevelByChallengeSlugQuery({ variables: { challengeSlug: challengeSlug as string, nth: Number(nthLevel) } });

  // mutation
  const [submitLevelMutation] = useSubmitMutation();

  const [initialCode] = useState<Code>(level?.code);

  const [currHtmlCode, setCurrHtmlCode] = useState<string>(level?.code?.html);
  const [currCssCode, setCurrCssCode] = useState<string>(level?.code?.css);
  // const [currJavascriptCode, setCurrJavascriptCode] = useState<string>(level?.code?.js);

  const resetToInitialCode = (language?: EditorLanguage): void => {
    // if language === undefined => reset all
    const newCode: Code = !language
      ? initialCode
      : {
          html: currHtmlCode,
          css: currCssCode,
          // js: currJavascriptCode,
        };

    if (language) {
      newCode[language] = initialCode[language];
    }

    setCurrHtmlCode(newCode.html);
    setCurrCssCode(newCode.css);
    // setCurrJavascriptCode(newCode.js);
  };

  const submitLevel = (): void => {
    submitLevelMutation({
      variables: {
        submissionInput: {
          levelId: level.id,
          html: currHtmlCode,
          css: currCssCode,
          // js: currJavascriptCode,
        },
      },
    });
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
            instructions: level.instructions,
            tldr: level.tldr,
            requirements: level.requirements,
          }}
          hints={level.hints}
          resources={level.resources}
        />
        <div className="flex justify-between flex-col flex-auto h-full box-border pl-4 relative">
          <Editors
            reset={resetToInitialCode}
            classes="w-full h-3/5"
            editors={[
              { languageLabel: "HTML", language: EditorLanguage.html, code: currHtmlCode, updateCode: setCurrHtmlCode, heading: "index.html" },
              { languageLabel: "CSS", language: EditorLanguage.css, code: currCssCode, updateCode: setCurrCssCode, heading: "index.css" },
              // {
              //   languageLabel: "JavaScript",
              //   language: EditorLanguage.javascript,
              //   code: currJavascriptCode,
              //   updateCode: setCurrJavascriptCode,
              //   heading: "index.js",
              // },
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
          <Preview classes="w-full h-2/5" heading="Preview" htmlCode={currHtmlCode} cssCode={currCssCode} javascriptCode={""} />
          <div className="absolute right-0 bottom-0 pt-4 pl-4 pr-2 pb-2 bg-white border-primary border-t-2 border-l-2 rounded-tl-lg">
            <Button full onClick={submitLevel} className="px-10 tracking-wider">
              Submit
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();

  const { challengeSlug, nthLevel } = context.params;

  await apolloClient.query<LevelByChallengeSlugQueryResult, LevelByChallengeSlugQueryVariables>({
    query: LevelByChallengeSlugDocument,
    variables: {
      challengeSlug: challengeSlug as string,
      nth: Number(nthLevel),
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
