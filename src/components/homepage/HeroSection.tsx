"use client";

import IllustrationFloatingWoman from "app/components/icons/IllustrationFloatingWomen";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import AnimationButton from "../buttons/AnimationButton";
import { useAnimationsContext } from "./UseAnimationsContext";

const HeroSection: React.FunctionComponent = () => {
  const { animationsEnabled, toggleAnimations } = useAnimationsContext();
  return (
    <section
      className={clsx(
        "mb-4 flex flex-col-reverse mt-2",
        "xs:mt-6",
        "sm:mb-12 sm:mt-8",
        "md:mt-8 md:flex-row",
        "xl:mb-24 xl:min-h-[80vh] md:flex-row xl:items-center",
      )}
    >
      <div className={clsx("flex flex-col justify-center mb-20", "md:mb-4", "xl:shrink xl:grow xl:mb-0")}>
        <h1 className={clsx("mb-6 h3 leading-tight", "sm:h2 sm:leading-tight", "md:max-w-[20ch]", "xl:h1 xl:leading-tight xl:max-w-[15ch]")}>
          Learning web accessibility made easy
        </h1>
        <p className={clsx("text-grey-middle text-lg max-w-[60ch]")}>
          a11yphant teaches web accessibility, one step at a time, broken down into manageable pieces. Completely free of charge.
        </p>
        <Link
          href="/challenges"
          className={clsx(
            "w-max mt-8 px-6 py-2.5 font-medium bg-primary text-light border-primary border-2 rounded tracking-wider inline-flex items-center",
            "transition duration-300",
            "hover:text-light hover:bg-primary-dark hover:border-primary-dark",
          )}
        >
          Start Coding
        </Link>
      </div>
      <div className={clsx("flex justify-center mb-6", "md:mb-0 md:max-w-xs md:ml-12", "lg:max-w-sm", "xl:max-w-full")}>
        <IllustrationFloatingWoman className={clsx("h-auto move-floating-woman", !animationsEnabled && "stopAnimation")} />
        <AnimationButton animation={animationsEnabled} onClick={() => toggleAnimations()} />
      </div>
    </section>
  );
};

export default HeroSection;
