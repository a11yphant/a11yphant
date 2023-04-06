import { render, screen } from "@testing-library/react";
import { Modal } from "app/components/modal/Modal";
import { ModalContent } from "app/components/modal/ModalContent";
import React from "react";

const WrapperModal: React.FC = ({ children }) => (
  <Modal open={true} onClose={jest.fn()}>
    {children}
  </Modal>
);

describe("ModalContent", () => {
  it("renders the children", () => {
    render(
      <ModalContent>
        <p>Child</p>
      </ModalContent>,
      { wrapper: WrapperModal },
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
