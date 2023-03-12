import { render, screen } from "@testing-library/react";
import About from "app/pages/about";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("../../public/images/showcase/a11yphant-coding-challenge.jpg", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <></>;
  },
}));

describe("about", () => {
  it("renders the page", () => {
    render(<About />);

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  });
});
