import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import ChallengeHeader, { ChallengeHeaderProps } from "app/components/homepage/ChallengeHeader";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { shallow, ShallowWrapper } from "enzyme";

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

const shallowRenderChallengeHeader = (props?: Partial<ChallengeHeaderProps>): ShallowWrapper => {
  return shallow(<ChallengeHeader {...props} />);
};

describe("ChallengeHeader", () => {
  it("renders the heading and description text", () => {
    render(<ChallengeHeader />);

    expect(screen.getByText("Challenges", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByText("Pick a challenge from below", { selector: "p" })).toBeInTheDocument();
  });

  it("renders the sign up text", () => {
    render(<ChallengeHeader userLoggedIn={false} />);

    expect(screen.getByText("Pick a challenge from below", { selector: "p" })).toBeInTheDocument();
  });

  it("renders the sign up button", () => {
    const userAccountModalApi = useUserAccountModalApi();
    render(<ChallengeHeader userLoggedIn={false} />);

    screen.getByRole("button", { name: "Sign Up" }).click();

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("signup");
  });

  it("renders the github button", () => {
    const view = shallowRenderChallengeHeader({ userLoggedIn: false });

    expect(view.find("a").contains("<GitHub />"));
  });

  it("renders the twitter button", () => {
    const view = shallowRenderChallengeHeader({ userLoggedIn: false });

    expect(view.find("a").contains("<Twitter />"));
  });
});
