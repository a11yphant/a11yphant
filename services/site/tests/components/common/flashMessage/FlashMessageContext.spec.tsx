import { act, render, screen } from "@testing-library/react";
import { FlashMessageApi, FlashMessageContextProvider, useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import React from "react";

describe("FlashMessageContextProvider", () => {
  it("renders children", () => {
    render(
      <FlashMessageContextProvider>
        <div data-testid="child" />
      </FlashMessageContextProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("useFlashMessageApi", () => {
  const ComponentWithFlashMessageApi = ({ cb }: { cb: (flashMessageApi: FlashMessageApi) => void }): React.ReactElement => {
    const flashMessageApi = useFlashMessageApi();

    React.useEffect(() => {
      cb(flashMessageApi);
    }, []);

    return <FlashMessagePortalRoot />;
  };

  it("show function displays message", async () => {
    let flashMessageApi: FlashMessageApi;
    const message = "Mock Message";
    render(
      <ComponentWithFlashMessageApi
        cb={(api) => {
          flashMessageApi = api;
        }}
      />,
      { wrapper: FlashMessageContextProvider },
    );

    await act(async () => {
      flashMessageApi.show(message);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("hide function hides flash message", async () => {
    let flashMessageApi: FlashMessageApi;
    const message = "Mock Message";
    render(
      <ComponentWithFlashMessageApi
        cb={(api) => {
          flashMessageApi = api;
        }}
      />,
      { wrapper: FlashMessageContextProvider },
    );

    await act(async () => {
      flashMessageApi.show(message);
      await new Promise((resolve) => setTimeout(resolve, 0));
      flashMessageApi.hide();
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });
});
