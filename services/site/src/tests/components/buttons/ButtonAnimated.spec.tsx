import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import ButtonAnimated from "app/components/buttons/ButtonAnimated";
import React from "react";

const buttonText = "Button Text";

afterEach(cleanup);

describe("Button Animated", () => {
  it("renders text", () => {
    const { container } = render(<ButtonAnimated loading={false}>{buttonText}</ButtonAnimated>);

    expect(screen.getByText(buttonText, { selector: "button span" })).toBeTruthy();
    expect(container.querySelectorAll("button")).toHaveProperty("length", 1);
  });

  it("className is added", () => {
    const cl = "test-class";
    const { container } = render(
      <ButtonAnimated className={cl} loading={false}>
        {buttonText}
      </ButtonAnimated>,
    );

    expect(container.querySelector("button").classList.contains(cl)).toBeTruthy();
  });

  it("override className", () => {
    const { container } = render(
      <ButtonAnimated overrideClassname loading={false}>
        {buttonText}
      </ButtonAnimated>,
    );

    expect(container.querySelector("button").classList.length).toBeLessThanOrEqual(2);
  });

  it("full attribute works", () => {
    const { container } = render(
      <ButtonAnimated full loading={false}>
        {buttonText}
      </ButtonAnimated>,
    );

    expect(container.querySelector("button.bg-primary")).toBeTruthy();
    expect(container.querySelector("button.text-white")).toBeTruthy();
  });

  it("Screen reader text is displayed", () => {
    const srText = "Screen Reader Text";

    render(
      <ButtonAnimated srText={srText} loading={false}>
        {buttonText}
      </ButtonAnimated>,
    );

    expect(screen.getByText(srText, { selector: "span" })).toBeTruthy();
  });

  it("loading svg is displayed", () => {
    const { container } = render(<ButtonAnimated loading={true}>{buttonText}</ButtonAnimated>);

    expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);
  });
});
