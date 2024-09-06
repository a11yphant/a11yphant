import clsx from "clsx";
import Image from "next/image";
import React from "react";

import a11yWeeklyLogo from "../../../public/images/otherLogos/a11yweekly.png";
import adcLogo from "../../../public/images/otherLogos/adc.png";
import ccaLogo from "../../../public/images/otherLogos/cca.png";
import pageLogo from "../../../public/images/otherLogos/pagemagazine.png";
import smashingLogo from "../../../public/images/otherLogos/smashingmagazine.png";

const MediaSection: React.FunctionComponent<React.PropsWithChildren> = () => {
  return (
    <section className={clsx("flex flex-col items-center", "sm:my-20", "xl:my-24")} aria-labelledby="MediaSectionHeading">
      <h2 id="MediaSectionHeading" className={clsx("h4 mb-2", "sm:h3 sm:text-center", "xl:h2")}>
        Recognized by the media
      </h2>
      <p className={clsx("block py-1.5 px-4 mb-8 mt-4 text-light font-medium not-italic uppercase tracking-[0.18rem] text-center text-sm")}>
        Awarded 1x Distinction and 1x Shortlist in 2023
      </p>
      <div className={clsx("flex flex-col justify-center items-center", "xs:flex-row xs:flex-wrap", "md:mx-18", "lg:mx-0")}>
        <Image
          alt="Creative Club Austria Logo"
          src={ccaLogo}
          quality={80}
          placeholder="blur"
          priority
          sizes="80ch"
          style={{
            maxWidth: "5rem",
            height: "auto",
            marginTop: "1rem",
            marginRight: "0.88rem",
            marginLeft: "0.88rem",
            marginBottom: "1rem",
          }}
        />
        <Image
          alt="Art Directors Club Logo"
          src={adcLogo}
          quality={80}
          placeholder="blur"
          priority
          sizes="80ch"
          style={{
            maxWidth: "5rem",
            height: "auto",
            marginTop: "1rem",
            marginRight: "0.88rem",
            marginLeft: "0.88rem",
            marginBottom: "1rem",
          }}
        />
        <span className="w-0.5 h-28 bg-grey-light mx-4 hidden lg:block" />
        <Image
          alt="Page Magazine Logo"
          src={pageLogo}
          quality={80}
          placeholder="blur"
          priority
          sizes="80ch"
          style={{
            maxWidth: "10%",
            maxHeight: "10%",
            minWidth: "8rem",
            height: "auto",
            marginTop: "1rem",
            marginRight: "0.88rem",
            marginLeft: "0.88rem",
            marginBottom: "1rem",
          }}
        />
        <Image
          alt="A11y Weekly Newsletter Logo"
          src={a11yWeeklyLogo}
          quality={80}
          placeholder="blur"
          priority
          sizes="80ch"
          style={{
            maxWidth: "11rem",
            height: "auto",
            marginTop: "1rem",
            marginRight: "0.88rem",
            marginLeft: "0.88rem",
            marginBottom: "1rem",
          }}
        />
        <Image
          alt="Smashing Magazine Logo"
          src={smashingLogo}
          quality={80}
          placeholder="blur"
          priority
          sizes="80ch"
          style={{
            maxWidth: "12rem",
            height: "auto",
            marginTop: "1rem",
            marginRight: "0.88rem",
            marginLeft: "0.88rem",
            marginBottom: "1rem",
            paddingTop: "1rem",
          }}
        />
      </div>
    </section>
  );
};

export default MediaSection;
