import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import ChallengeHeader from "app/components/homepage/ChallengeHeader";

afterEach(cleanup);

describe("ChallengeHeader", () => {
  it("renders correctly", () => {
    render(<ChallengeHeader />);

    expect(screen.getByText("Challenges", { selector: "h2" })).toBeTruthy();
    expect(screen.getByText("Pick a challenge from below", { selector: "p" })).toBeTruthy();
  });
});
