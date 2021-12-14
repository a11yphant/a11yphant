import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import Check from "app/components/icons/Check";
import Chevron from "app/components/icons/Chevron";
import Github from "app/components/icons/Github";
import IllustrationCodingMan from "app/components/icons/IllustrationCodingMan";
import IllustrationCodingWoman from "app/components/icons/IllustrationCodingWoman";
import IllustrationLost from "app/components/icons/IllustrationLost";
import IllustrationLostSpace from "app/components/icons/IllustrationLostSpace";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import Reset from "app/components/icons/Reset";
import Slash from "app/components/icons/Slash";
import Twitter from "app/components/icons/Twitter";
import UserAvatar from "app/components/icons/UserAvatar";
import X from "app/components/icons/X";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

describe("Icons", () => {
  it("renders the a11yphant Logo SVG", () => {
    const wrapper = shallow(<A11yphantLogo />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `Check` SVG", () => {
    const wrapper = shallow(<Check />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `Chevron` SVG", () => {
    const wrapper = shallow(<Chevron />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `Github` SVG", () => {
    const wrapper = shallow(<Github />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `IllustrationCodingWoman` SVG", () => {
    const wrapper = shallow(<IllustrationCodingWoman />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `IllustrationCodingMan` SVG", () => {
    const wrapper = shallow(<IllustrationCodingMan />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `IllustrationLost` SVG", () => {
    const wrapper = shallow(<IllustrationLost />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `IllustrationLostSpace` SVG", () => {
    const wrapper = shallow(<IllustrationLostSpace />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `Reset` SVG", () => {
    const wrapper = shallow(<Reset />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `Slash` SVG", () => {
    const wrapper = shallow(<Slash />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `Twitter` SVG", () => {
    const wrapper = shallow(<Twitter />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `UserAvatar` SVG", () => {
    const wrapper = shallow(<UserAvatar />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `X` SVG", () => {
    const wrapper = shallow(<X />);

    expect(wrapper.type()).toBe("svg");
  });

  it("renders the `LoadingIndicator` SVG", () => {
    const wrapper = shallow(<LoadingIndicator />);

    expect(wrapper.type()).toBe("svg");
  });
});
