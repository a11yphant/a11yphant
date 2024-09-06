import { render, screen } from "@testing-library/react";
import Button, { ButtonProps } from "app/components/buttons/Button";
import React from "react";

const buttonText = "Button Text";

const renderButton = (props?: Partial<ButtonProps>): void => {
  render(<Button {...props}>{buttonText}</Button>);
};

describe("Button", () => {
  it("renders button with text", () => {
    renderButton();

    expect(screen.getByRole("button", { name: buttonText })).toBeInTheDocument();
  });

  it("adds className to the button", () => {
    const cl = "test-class";
    renderButton({ className: cl });

    expect(screen.getByRole("button")).toHaveClass(cl);
  });

  it("overrides className with custom property `overrideClassName`", () => {
    renderButton({ overrideClassName: true });

    const classList = screen.getByRole("button").classList;
    // filter undefined, false and null values
    const filteredClassList = Object.entries(classList).filter(([_, value]) => !value);

    expect(filteredClassList).toHaveLength(0);
  });

  it("renders primary button styles", () => {
    renderButton({ primary: true });

    expect(screen.getByRole("button")).toHaveClass("bg-primary");
    expect(screen.getByRole("button")).toHaveClass("text-light");
  });

  it("renders screen reader text", () => {
    const srText = "Screen Reader Text";

    renderButton({
      srText: srText,
    });

    expect(screen.getByText(srText, { selector: ".sr-only" })).toBeInTheDocument();
  });
});
