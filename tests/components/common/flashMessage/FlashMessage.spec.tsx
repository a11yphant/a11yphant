import { act, render, screen } from "@testing-library/react";
import { FlashMessage, FlashMessageProps, FlashMessageType } from "app/components/common/flashMessage/FlashMessage";
import React from "react";

const renderFlashMessage = async ({ children, ...props }: Partial<React.PropsWithChildren<FlashMessageProps>> = {}): Promise<void> => {
  render(
    <FlashMessage show={true} onClose={jest.fn()} {...props}>
      {children}
    </FlashMessage>,
  );

  // wait for appear transition to be randered, this updates state within
  // the transition component, hence the act
  await act(async () => await new Promise((resolve) => setTimeout(resolve, 0)));
};

describe("FlashMessage", () => {
  it("renders children", async () => {
    const message = "Mock Message";
    await renderFlashMessage({ children: message });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("calls onClose on close button click", async () => {
    const onClose = jest.fn();
    await renderFlashMessage({ onClose });

    screen.getByRole("button", { name: "Close" }).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sets role to 'alert' if type = FlashMessageType.ALERT", async () => {
    await renderFlashMessage({ type: FlashMessageType.ALERT });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("sets role to 'status' if type = FlashMessageType.STATUS", async () => {
    await renderFlashMessage({ type: FlashMessageType.STATUS });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
