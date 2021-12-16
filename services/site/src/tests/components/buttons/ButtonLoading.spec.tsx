import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import ButtonLoading, { ButtonLoadingProps } from "app/components/buttons/ButtonLoading";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import { shallow } from "enzyme";
import React from "react";

const buttonText = "Button Text";

const renderButtonLoading = (props?: Partial<ButtonLoadingProps>): void => {
  render(
    <ButtonLoading loading={false} {...props}>
      {buttonText}
    </ButtonLoading>,
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
    const view = shallow(<ButtonLoading loading={true}>{buttonText}</ButtonLoading>);

    expect(view.exists(LoadingIndicator)).toBeTruthy();
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
