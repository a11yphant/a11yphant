import { render, screen } from "@testing-library/react";
import ChallengeHeader from "app/components/challengePage/ChallengeHeader";

afterEach(() => {
  jest.clearAllMocks();
});

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
    hide: mockHide,
  }),
}));

describe("ChallengeHeader", () => {
  it("renders the heading and description text", () => {
    render(<ChallengeHeader />);

    expect(screen.getByText("Challenges", { selector: "h1" })).toBeInTheDocument();
    expect(screen.getByText("Pick a challenge from below", { selector: "p" })).toBeInTheDocument();
  });

  it("renders the sign up text", () => {
    render(<ChallengeHeader />);

    expect(screen.getByText("Pick a challenge from below", { selector: "p" })).toBeInTheDocument();
  });
});
