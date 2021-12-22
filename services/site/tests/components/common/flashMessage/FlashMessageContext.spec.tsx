import { act, render, screen } from "@testing-library/react";
import { FlashMessage } from "app/components/common/flashMessage/FlashMessage";
import { FlashMessageApi, FlashMessageContextProvider, useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import { shallow } from "enzyme";
import React from "react";

describe("FlashMessageContextProvider", () => {
  it("renders FlashMessage", () => {
    const view = shallow(<FlashMessageContextProvider />);

    expect(view.exists(FlashMessage)).toBeTruthy();
  });

  it("renders children", () => {
    const ChildComponent = (): React.ReactElement => <div />;
    const view = shallow(
      <FlashMessageContextProvider>
        <ChildComponent />
      </FlashMessageContextProvider>,
    );

    expect(view.exists(ChildComponent)).toBeTruthy();
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

  it("show function displays message", () => {
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

    act(() => {
      flashMessageApi.show(message);
    });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("hide function hides flash message", () => {
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

    act(() => {
      flashMessageApi.show(message);
      flashMessageApi.hide();
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });
});
