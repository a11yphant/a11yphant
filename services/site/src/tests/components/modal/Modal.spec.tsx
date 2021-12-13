import { Dialog } from "@headlessui/react";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import { Modal } from "app/components/modal/Modal";
import { shallow } from "enzyme";
import React from "react";

const mockOnClose = jest.fn();

describe("Modal", () => {
  it("renders an open modal", () => {
    const wrapper = shallow(<Modal open={true} onClose={mockOnClose} />);

    expect(wrapper.find(Dialog).props().open).toBeTruthy();
  });

  it("renders a closed modal", () => {
    const wrapper = shallow(<Modal open={false} onClose={mockOnClose} />);

    expect(wrapper.find(Dialog).props().open).toBeFalsy();
  });

  it("renders the background overlay", () => {
    const wrapper = shallow(<Modal open={false} onClose={mockOnClose} />);

    expect(wrapper.exists(Dialog.Overlay)).toBeTruthy();
  });

  it("renders the `children`", () => {
    const ChildComponent: React.FunctionComponent = () => <>Child Component</>;
    const wrapper = shallow(
      <Modal open={false} onClose={mockOnClose}>
        <ChildComponent />
      </Modal>,
    );

    expect(wrapper.exists(ChildComponent)).toBeTruthy();
  });

  it("calls onClose on `X` button press", () => {
    const wrapper = shallow(<Modal open={false} onClose={mockOnClose} />);

    wrapper.find(X).closest(Button).simulate("click");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
