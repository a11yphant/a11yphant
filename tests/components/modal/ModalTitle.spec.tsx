import { act, render, screen } from "@testing-library/react";
import { Modal } from "app/components/modal/Modal";
import { ModalTitle } from "app/components/modal/ModalTitle";
import React from "react";

const WrapperModal: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Modal open={true} onClose={jest.fn()}>
    {children}
  </Modal>
);

describe("ModalTitle", () => {
  it("renders the children", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<ModalTitle>Child</ModalTitle>, { wrapper: WrapperModal });
    });

    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("renders the title as component specified in 'as' prop", async () => {
    let container: HTMLElement;
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      const { container: renderedContainer } = render(<ModalTitle as="div" />, { wrapper: WrapperModal });
      container = renderedContainer;
    });

    // eslint-disable-next-line testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector("div")).toBeInTheDocument();
  });
});
