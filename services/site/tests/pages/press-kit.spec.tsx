import { render, screen } from "@testing-library/react";
import PressKit from "app/pages/press-kit";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("../../public/images/showcase/a11yphant-coding-challenge.jpg", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("../../public/images/showcase/a11yphant-quiz.jpg", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("../../public/images/showcase/a11yphant_challenge_result.jpg", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("../../public/images/showcase/a11yphant_challenge_overview.jpg", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("../../public/images/showcase/a11yphant_challenge_detail.jpg", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("../../public/images/logo/a11yphant_Logo_combination-mark_dark.png", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("../../public/images/logo/a11yphant_Logo_combination-mark_light.png", () => ({
  src: "",
  height: 0,
  width: 0,
}));

jest.mock("../../public/images/logo/a11yphant_Logo_pictorial-mark.png", () => ({
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
describe("press-kit", () => {
  it("renders the page", () => {
    render(<PressKit />);

    expect(screen.getByRole("heading", { name: "Press Kit" })).toBeInTheDocument();
  });
});
