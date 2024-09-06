import { render, screen } from "@testing-library/react";
import LoadingButton, { LoadingButtonProps } from "app/components/buttons/LoadingButton";
import React from "react";

const buttonText = "Button Text";

const renderButtonLoading = (props?: Partial<LoadingButtonProps>): void => {
  render(
    <LoadingButton loading={false} {...props}>
      {buttonText}
    </LoadingButton>,
  );
};

describe("Button Loading", () => {
  it("renders button with text", () => {
    renderButtonLoading();

    expect(screen.getByRole("button", { name: buttonText })).toBeInTheDocument();
  });

  it("adds className to the button", () => {
    const cl = "test-class";
    renderButtonLoading({ className: cl });

    expect(screen.getByRole("button")).toHaveClass(cl);
  });

  it("overrides className with custom property `overrideClassName`", () => {
    renderButtonLoading({ overrideClassName: true });

    const classList = screen.getByRole("button").classList;
    // filter undefined, false and null values
    const filteredClassList = Object.entries(classList).filter(([_, value]) => !value);

    expect(filteredClassList).toHaveLength(0);
  });

  it("renders primary button styles", () => {
    renderButtonLoading({ primary: true });

    expect(screen.getByRole("button")).toHaveClass("bg-primary");
    expect(screen.getByRole("button")).toHaveClass("text-light");
  });

  it("renders screen reader text", () => {
    const srText = "Screen Reader Text";
    renderButtonLoading({
      srText: srText,
    });

    expect(screen.getByText(srText, { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("renders svg loading icon", () => {
    const { container } = render(<LoadingButton loading={true}>{buttonText}</LoadingButton>);

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders screen reader loading text", () => {
    const srTextLoading = "Screen Reader Text Loading";
    renderButtonLoading({
      loading: true,
      srTextLoading: srTextLoading,
    });

    expect(screen.getByText(srTextLoading, { selector: ".sr-only" })).toBeInTheDocument();
  });
});
