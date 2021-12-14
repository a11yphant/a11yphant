import { ModalContent } from "app/components/modal/ModalContent";
import { shallow } from "enzyme";
import React from "react";

describe("ModalContent", () => {
  it("renders the children", () => {
    const ChildComponent: React.FunctionComponent = () => <>Child Component</>;
    const wrapper = shallow(
      <ModalContent>
        <ChildComponent />
      </ModalContent>,
    );

    expect(wrapper.exists(ChildComponent)).toBeTruthy();
  });
});
