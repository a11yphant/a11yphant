import { Dialog } from "@headlessui/react";
import { Modal } from "app/components/modal/Modal";
import { ModalTitle } from "app/components/modal/ModalTitle";
import { shallow } from "enzyme";
import React from "react";

const mockOnClose = jest.fn();

describe("ModalTitle", () => {
  it("renders Dialog.Title", () => {
    const wrapper = shallow(<ModalTitle />);

    expect(wrapper.exists(Dialog.Title)).toBeTruthy();
  });

  it("renders Dialog.Title as component specified in 'as' prop", () => {
    const wrapper = shallow(<ModalTitle as="div" />);

    expect(
      wrapper
        .find<{
          as?: React.ElementType;
        }>(Dialog.Title)
        .props().as,
    ).toBe("div");
  });

  it("renders children", () => {
    const ChildComponent: React.FunctionComponent = () => <>Child Component</>;
    const wrapper = shallow(
      <Modal open={false} onClose={mockOnClose}>
        <ChildComponent />
      </Modal>,
    );

    expect(wrapper.exists(ChildComponent)).toBeTruthy();
  });
});
