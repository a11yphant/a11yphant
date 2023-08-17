import { render, screen } from "@testing-library/react";
import InTextLink, { InTextLinkProps } from "app/components/links/InTextLink";
import React from "react";

const linkText = "Link Text";

const renderInTextLink = (props?: Partial<InTextLinkProps>): void => {
  render(
    <InTextLink href={"#"} {...props}>
      {linkText}
    </InTextLink>,
  );
};

describe("In text Link", () => {
  it("renders link with text", () => {
    renderInTextLink();

    expect(screen.getByRole("link", { name: linkText })).toBeInTheDocument();
  });

  it("adds className to the link", () => {
    const cl = "test-class";
    renderInTextLink({ className: cl });

    expect(screen.getByRole("link")).toHaveClass(cl);
  });

  it("overrides className with custom property `overrideClassName`", () => {
    renderInTextLink({ overrideClassName: true });

    const classList = screen.getByRole("link").classList;
    // filter undefined, false and null values
    const filteredClassList = Object.entries(classList).filter(([_, value]) => !value);

    expect(filteredClassList).toHaveLength(0);
  });
});
