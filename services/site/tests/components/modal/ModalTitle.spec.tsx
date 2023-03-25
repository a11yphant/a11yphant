import { render, screen } from "@testing-library/react";
import { Modal } from "app/components/modal/Modal";
import { ModalTitle } from "app/components/modal/ModalTitle";
import React from "react";

const WrapperModal: React.FC = ({ children }) => (
  <Modal open={true} onClose={jest.fn()}>
    {children}
  </Modal>
);

describe("ModalTitle", () => {
  it("renders the children", () => {
    render(<ModalTitle>Child</ModalTitle>, { wrapper: WrapperModal });

    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("renders the title as component specified in 'as' prop", () => {
    const { container } = render(<ModalTitle as="div" />, { wrapper: WrapperModal });

    // eslint-disable-next-line testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector("div")).toBeInTheDocument();
  });
});
