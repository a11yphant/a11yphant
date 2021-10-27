import { ModalActions } from "app/components/modal/ModalActions";
import { shallow } from "enzyme";
import React from "react";

describe("ModalActions", () => {
  it("renders children", () => {
    const ChildComponent: React.FunctionComponent = () => <>Child Component</>;
    const wrapper = shallow(
      <ModalActions>
        <ChildComponent />
      </ModalActions>,
    );

    expect(wrapper.exists(ChildComponent)).toBeTruthy();
  });
});
