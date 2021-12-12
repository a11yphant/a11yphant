import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Button from "app/components/buttons/Button";

const buttonText = "Button Text";

afterEach(cleanup);

describe("Button", () => {
  it("renders one button", () => {
    const { container } = render(<Button>{buttonText}</Button>);

    expect(container.querySelectorAll("button")).toHaveProperty("length", 1);
  });

  it("renders button text", () => {
    render(<Button>{buttonText}</Button>);

    expect(screen.getByText(buttonText, { selector: "button" })).toBeTruthy();
  });

  it("adds className to the button", () => {
    const cl = "test-class";
    render(<Button className={cl}>{buttonText}</Button>);

    expect(screen.getByText(buttonText, { selector: "button" }).classList.contains(cl)).toBeTruthy();
  });

  it("overrides className with custom property `overrideClassName`", () => {
    render(<Button overrideClassName>{buttonText}</Button>);

    // expected value is {"0": "undefined", "1": "false"}
    expect(screen.getByText(buttonText, { selector: "button" }).classList.length).toBeLessThanOrEqual(2);
  });

  it("renders primary button styles", () => {
    const { container } = render(<Button primary>{buttonText}</Button>);

    expect(container.querySelector("button.bg-primary")).toBeTruthy();
    expect(container.querySelector("button.text-light")).toBeTruthy();
  });

  it("renders screen reader text", () => {
    const icon = <svg />;
    const srText = "Screen Reader Text";

    render(
      <Button srText={srText}>
        {icon}
        {buttonText}
      </Button>,
    );

    expect(screen.getByText(srText, { selector: "span" })).toBeTruthy();
  });

  it("renders svg icon", () => {
    const icon = <svg />;
    const srText = "Screen Reader Text";

    const { container } = render(
      <Button srText={srText}>
        {icon}
        {buttonText}
      </Button>,
    );

    expect(screen.getByText(buttonText, { selector: "button" })).toBeTruthy();
    expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);
  });
});
