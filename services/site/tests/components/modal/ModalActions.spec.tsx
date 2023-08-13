import { render, screen } from "@testing-library/react";
import { ModalActions } from "app/components/modal/ModalActions";
import React from "react";

describe("ModalActions", () => {
  it("renders the children", () => {
    render(
      <ModalActions>
        <p>Child</p>
      </ModalActions>,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
