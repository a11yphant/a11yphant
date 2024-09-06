import { render, screen } from "@testing-library/react";
import SignUpSection from "app/components/homepage/SignUpSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("SignUp Section", () => {
  it("renders a UserAccountBox", () => {
    render(<SignUpSection />);

    expect(screen.getByRole("heading", { level: 2, name: "Sign up to save your progress!" })).toBeInTheDocument();
  });
});
