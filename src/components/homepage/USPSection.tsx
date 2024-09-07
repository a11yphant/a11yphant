"use client";

import clsx from "clsx";
import React from "react";

import IllustrationCouchWoman from "../icons/IllustrationCouchWoman";
import IllustrationPhoneWoman from "../icons/IllustrationPhoneWoman";
import USPItem from "./USPItem";

const USPSection: React.FunctionComponent = () => {
  return (
    <div className="my-8">
      <USPItem
        imageLeft
        heading="Study from the comfort of your home"
        paragraph={<>For challenges on a11yphant you won't need to read large amounts. Instead, you will learn by applying the concepts in code.</>}
        Illustration={IllustrationCouchWoman}
        illustrationClassName={clsx("h-auto mb-10 max-w-[15rem] md:max-w-full md:mb-0", "move-floating-woman-reverse")}
        illustrationWrapperClassNames="flex flex-row-reverse md:flex-row justify-start min-w-[46%] md:max-w-xs lg:max-w-sm xl:max-w-full lg:justify-end lg:pr-12"
      />
      <USPItem
        heading="Interactive coding challenges and quizzes"
        paragraph={
          <>
            With a phone, computer or tablet, a11yphant works wherever you are. Get started with your first web accessibility challenge and improve
            your skills.
          </>
        }
        Illustration={IllustrationPhoneWoman}
        illustrationClassName={clsx("h-auto mb-10 max-w-[15rem] md:max-w-full md:mb-0", "move-floating-woman")}
      />
    </div>
  );
};

export default USPSection;
