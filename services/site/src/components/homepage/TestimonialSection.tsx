import clsx from "clsx";
import React from "react";

const TestimonialSection: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <section className={clsx("my-12", "sm:my-20", "xl:my-24")}>
      <h2 className={clsx("text-center h4 mb-8", "sm:h3", "xl:h2")}>What others say about us</h2>
      <div className={clsx("flex flex-col justify-center xs:flex-row xs:flex-wrap")}>{children}</div>
    </section>
  );
};

export default TestimonialSection;
