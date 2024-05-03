import { render, screen } from "@testing-library/react";
import AnimationButton from "app/components/buttons/AnimationButton";
import React from "react";

describe("Button Loading", () => {
  it("renders button with Start text", () => {
    render(<AnimationButton animation={true} onClick={jest.fn}></AnimationButton>);

    expect(screen.getByRole("button").innerHTML).toContain("Stop");
  });

  it("renders button with Stop text", () => {
    render(<AnimationButton animation={false} onClick={jest.fn}></AnimationButton>);

    expect(screen.getByRole("button").innerHTML).toContain("Start");
  });
});
