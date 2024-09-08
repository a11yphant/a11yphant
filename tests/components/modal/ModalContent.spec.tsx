import { render, screen } from "@testing-library/react";
import { ModalContent } from "app/components/modal/ModalContent";
import React from "react";

describe("ModalContent", () => {
  it("renders the children", () => {
    render(
      <ModalContent>
        <p>Child</p>
      </ModalContent>,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
