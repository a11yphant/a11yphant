import { cleanup, render } from "@testing-library/react";
import Lottie from "app/components/Lottie";
import lottie from "lottie-web";
import React from "react";

jest.mock("lottie-web", () => ({
  __esModule: true,
  default: {
    loadAnimation: jest.fn(),
  },
}));

afterEach(cleanup);

describe("lottie", () => {
  const destroy = jest.fn();
  const goToAndStop = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (lottie.loadAnimation as jest.Mock).mockReturnValue({
      destroy,
      goToAndStop,
      totalFrames: 15,
    });
  });

  it("renders the wrapper element", () => {
    const { container } = render(<Lottie options={{}} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders the lottie animation", () => {
    render(<Lottie options={{}} />);

    expect(lottie.loadAnimation).toHaveBeenCalled();
  });

  it("destroys the animation after unmount", () => {
    const { unmount } = render(<Lottie options={{}} />);
    unmount();
    expect(destroy).toHaveBeenCalled();
  });

  it("goes to last frame and stops", () => {
    render(<Lottie options={{}} />);

    expect(goToAndStop).toHaveBeenCalledWith(14, true);
  });
});
