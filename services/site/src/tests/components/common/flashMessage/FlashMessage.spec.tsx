import { render, screen } from "@testing-library/react";
import { FlashMessage, FlashMessageProps, FlashMessageType } from "app/components/common/flashMessage/FlashMessage";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import React from "react";

const renderFlashMessageWithPortalRoot = (props?: Partial<React.PropsWithChildren<FlashMessageProps>>): void => {
  const wrapper = ({ children }): React.ReactElement => (
    <div>
      <FlashMessagePortalRoot />
      {children}
    </div>
  );
  render(<FlashMessage show={true} onClose={jest.fn()} {...props} />, { wrapper });
};

describe("FlashMessage", () => {
  it("log console error if no FlashMessagePortalRoot is present", () => {
    console.error = jest.fn();

    render(<FlashMessage show={true} onClose={jest.fn()} />);

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("renders children", () => {
    const message = "Mock Message";
    renderFlashMessageWithPortalRoot({ children: message });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("calls onClose on close button click", () => {
    const onClose = jest.fn();
    renderFlashMessageWithPortalRoot({ onClose });

    screen.getByRole("button", { name: "Close" }).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sets role to 'alert' if type = FlashMessageType.ALERT", () => {
    renderFlashMessageWithPortalRoot({ type: FlashMessageType.ALERT });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("sets role to 'status' if type = FlashMessageType.STATUS", () => {
    renderFlashMessageWithPortalRoot({ type: FlashMessageType.STATUS });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
