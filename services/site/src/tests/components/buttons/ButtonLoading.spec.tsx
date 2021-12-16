import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import LoadingButton from "app/components/buttons/LoadingButton";
import React from "react";

const buttonText = "Button Text";

afterEach(cleanup);

describe("Button Loading", () => {
  it("renders button text", () => {
    const { container } = render(<LoadingButton loading={false}>{buttonText}</LoadingButton>);

    expect(screen.getByText(buttonText, { selector: "button span" })).toBeTruthy();
    expect(container.querySelectorAll("button")).toHaveProperty("length", 1);
  });

  it("adds className to the button", () => {
    const cl = "test-class";
    const { container } = render(
      <LoadingButton className={cl} loading={false}>
        {buttonText}
      </LoadingButton>,
    );

    expect(container.querySelector("button").classList.contains(cl)).toBeTruthy();
  });

  it("overrides className with custom property `overrideClassName`", () => {
    const { container } = render(
      <LoadingButton overrideClassName loading={false}>
        {buttonText}
      </LoadingButton>,
    );

    // expected value is {"0": "undefined", "1": "false"}
    expect(container.querySelector("button").classList.length).toBeLessThanOrEqual(2);
  });

  it("renders primary button styles", () => {
    const { container } = render(
      <LoadingButton primary loading={false}>
        {buttonText}
      </LoadingButton>,
    );

    expect(container.querySelector("button.bg-primary")).toBeTruthy();
    expect(container.querySelector("button.text-light")).toBeTruthy();
  });

  it("renders screen reader text", () => {
    const srText = "Screen Reader Text";

    render(
      <LoadingButton srText={srText} loading={false}>
        {buttonText}
      </LoadingButton>,
    );

    expect(screen.getByText(srText, { selector: "span" })).toBeTruthy();
  });

  it("renders svg loading icon", () => {
    const { container } = render(<LoadingButton loading={true}>{buttonText}</LoadingButton>);

    expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);
  });
});
