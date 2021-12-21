import { FlashMessage } from "app/components/common/flashMessage/FlashMessage";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/useFlashMessage";
import { shallow } from "enzyme";

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
