import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import USPSection from "app/components/homepage/USPSection";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn().mockReturnValue([{}, {}]),
}));

describe("USP Section", () => {
  it("renders one heading", () => {
    render(
      <MockedProvider>
        <USPSection
          heading="Interactive coding challenges and quizzes"
          paragraph="With a phone, computer or tablet, a11yphant works wherever you are. Get started with your first web accessibility challenge and improve your skills."
        />
      </MockedProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });
});
