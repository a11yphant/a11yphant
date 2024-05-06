import { render, screen } from "@testing-library/react";
import PressKit from "app/pages/press-kit";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <></>;
  },
}));
describe("press-kit", () => {
  it("renders the page", () => {
    render(<PressKit />);

    expect(screen.getByRole("heading", { name: "Press Kit" })).toBeInTheDocument();
  });
});
