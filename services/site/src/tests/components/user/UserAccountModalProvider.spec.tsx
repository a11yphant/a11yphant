import UserAccountModal from "app/components/user/UserAccountModal";
import { UserAccountModalProvider } from "app/components/user/UserAccountModalProvider";
import { shallow } from "enzyme";
import React from "react";

describe("UserAccountModalProvider", () => {
  it("renders UserAccountModal", () => {
    const wrapper = shallow(<UserAccountModalProvider />);

    expect(wrapper.exists(UserAccountModal)).toBeTruthy();
  });

  it("renders children", () => {
    const ChildComponent: React.FunctionComponent = () => null;
    const wrapper = shallow(
      <UserAccountModalProvider>
        <ChildComponent />
      </UserAccountModalProvider>,
    );

    expect(wrapper.exists(ChildComponent)).toBeTruthy();
  });
});
