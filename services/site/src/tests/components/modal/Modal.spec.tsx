import { Dialog } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import { Modal, ModalActions, ModalContent, ModalTitle } from "app/components/modal/Modal";
import { shallow } from "enzyme";
import React from "react";

const mockOnClose = jest.fn();

describe("Modal", () => {
  it("is open", () => {
    const wrapper = shallow(<Modal open={true} onClose={mockOnClose} />);

    expect(wrapper.find(Dialog).props().open).toBeTruthy();
  });

  it("is closed", () => {
    const wrapper = shallow(<Modal open={false} onClose={mockOnClose} />);

    expect(wrapper.find(Dialog).props().open).toBeFalsy();
  });

  it("renders Dialog.Overlay", () => {
    const wrapper = shallow(<Modal open={false} onClose={mockOnClose} />);

    expect(wrapper.exists(Dialog.Overlay)).toBeTruthy();
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

  it("calls onClose on X press", () => {
    const wrapper = shallow(<Modal open={false} onClose={mockOnClose} />);

    wrapper.find(X).closest(Button).simulate("click");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

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

describe("ModalContent", () => {
  it("renders children", () => {
    const ChildComponent: React.FunctionComponent = () => <>Child Component</>;
    const wrapper = shallow(
      <ModalContent>
        <ChildComponent />
      </ModalContent>,
    );

    expect(wrapper.exists(ChildComponent)).toBeTruthy();
  });
});

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
