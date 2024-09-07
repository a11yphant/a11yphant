import { render, screen } from "@testing-library/react";
import ChallengeSignUpPrompt from "app/components/challengePage/ChallengeSignUpPrompt";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";

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

describe("ChallengeSignUpPrompt", () => {
  it("renders the description text", () => {
    render(<ChallengeSignUpPrompt userLoggedIn={false} />);

    expect(screen.getByText("Why not sign up and track your stats and save your progress?", { selector: "p" })).toBeInTheDocument();
  });

  it("renders the sign up text", () => {
    render(<ChallengeSignUpPrompt userLoggedIn={false} />);

    expect(screen.getByText("Sign Up", { selector: "button" })).toBeInTheDocument();
  });

  it("renders the sign up button", () => {
    const userAccountModalApi = useUserAccountModalApi();
    render(<ChallengeSignUpPrompt userLoggedIn={false} />);

    screen.getByRole("button", { name: "Sign Up" }).click();

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("signup");
  });
});
