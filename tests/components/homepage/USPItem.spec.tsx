import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import USPItem from "app/components/homepage/USPItem";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("USP Item", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <USPItem
          heading="Interactive coding challenges and quizzes"
          paragraph="With a phone, computer or tablet, a11yphant works wherever you are. Get started with your first web accessibility challenge and improve your skills."
        />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });
});
