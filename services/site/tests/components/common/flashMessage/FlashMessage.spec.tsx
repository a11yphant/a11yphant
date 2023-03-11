import { render, screen } from "@testing-library/react";
import { FlashMessage, FlashMessageProps, FlashMessageType } from "app/components/common/flashMessage/FlashMessage";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import React from "react";

const renderFlashMessageWithPortalRoot = (props?: Partial<React.PropsWithChildren<FlashMessageProps>>): void => {
  const wrapper = ({ children }): React.ReactElement => (
    <FlashMessageContextProvider>
      <div>
        <FlashMessagePortalRoot />
        {children}
      </div>
    </FlashMessageContextProvider>
  );
  render(<FlashMessage show={true} onClose={jest.fn()} {...props} />, { wrapper });
};

describe("FlashMessage", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("log console error if no FlashMessagePortalRoot is present", () => {
    jest.spyOn(global.console, "error").mockImplementation(jest.fn());

    render(<FlashMessage show={true} onClose={jest.fn()} />);

    expect(global.console.error).toHaveBeenCalledTimes(1);
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
