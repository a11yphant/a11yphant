import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import ChallengeHeader, { ChallengeHeaderProps } from "app/components/homepage/ChallengeHeader";
import { shallow, ShallowWrapper } from "enzyme";

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const renderChallengeHeader = (props?: Partial<ChallengeHeaderProps>): ShallowWrapper => {
  return shallow(<ChallengeHeader {...props} />);
};

describe("ChallengeHeader", () => {
  it("renders correctly", () => {
    render(<ChallengeHeader />);

    expect(screen.getByText("Challenges", { selector: "h2" })).toBeTruthy();
    expect(screen.getByText("Pick a challenge from below", { selector: "p" })).toBeTruthy();
  });

  it("renders sign up text", () => {
    render(<ChallengeHeader userLoggedIn={false} />);

    expect(screen.getByText("Pick a challenge from below", { selector: "p" })).toBeTruthy();
  });

  it("renders sign up button", () => {
    render(<ChallengeHeader userLoggedIn={false} />);

    expect(screen.getByText("Sign Up", { selector: "button" })).toBeTruthy();
  });

  it("renders github button", () => {
    const wrapper = renderChallengeHeader({ userLoggedIn: false });

    expect(wrapper.find("a").contains("<GitHub />"));
  });

  it("renders twitter button", () => {
    const wrapper = renderChallengeHeader({ userLoggedIn: false });

    expect(wrapper.find("a").contains("<Twitter />"));
  });
});
