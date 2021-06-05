import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Button from "app/components/buttons/Button";

const buttonText = "Button Text";

afterEach(cleanup);

describe("Button", () => {
  it("renders text", () => {
    const { container } = render(<Button>{buttonText}</Button>);

    expect(screen.getByText(buttonText, { selector: "button" })).toBeTruthy();
    expect(container.querySelectorAll("button")).toHaveProperty("length", 1);
  });

  it("className is added", () => {
    const cl = "test-class";
    render(<Button className={cl}>{buttonText}</Button>);

    expect(screen.getByText(buttonText, { selector: "button" }).classList.contains(cl)).toBeTruthy();
  });

  it("override className", () => {
    render(<Button overrideClassname>{buttonText}</Button>);

    // expected value is {"0": "undefined", "1": "false"}
    expect(screen.getByText(buttonText, { selector: "button" }).classList.length).toBeLessThanOrEqual(2);
  });

  it("full attribute works", () => {
    const { container } = render(<Button full>{buttonText}</Button>);

    expect(container.querySelector("button.bg-primary")).toBeTruthy();
    expect(container.querySelector("button.text-white")).toBeTruthy();
  });

  it("icon works", () => {
    const icon = <svg />;
    const srText = "Screen Reader Text";

    const { container } = render(
      <Button iconLeft={icon} srText={srText}>
        {buttonText}
      </Button>,
    );

    expect(screen.getByText(buttonText, { selector: "button" })).toBeTruthy();
    expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);
    expect(screen.getByText(srText, { selector: "span" })).toBeTruthy();
  });
});
