import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import Check from "app/components/icons/Check";
import Chevron from "app/components/icons/Chevron";
import Github from "app/components/icons/Github";
import IllustrationCoding from "app/components/icons/IllustrationCoding";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import Reset from "app/components/icons/Reset";
import Save from "app/components/icons/Save";
import Slash from "app/components/icons/Slash";
import Twitter from "app/components/icons/Twitter";
import UserAvatar from "app/components/icons/UserAvatar";
import X from "app/components/icons/X";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

describe("Icons", () => {
  it("A11yphant Logo exists", () => {
    const wrapper = shallow(<A11yphantLogo />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Check exists", () => {
    const wrapper = shallow(<Check />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Chevron exists", () => {
    const wrapper = shallow(<Chevron />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Github exists", () => {
    const wrapper = shallow(<Github />);

    expect(wrapper.type()).toBe("svg");
  });

  it("ArrowLeft exists", () => {
    const wrapper = shallow(<IllustrationCoding />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Reset exists", () => {
    const wrapper = shallow(<Reset />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Save exists", () => {
    const wrapper = shallow(<Save />);

    expect(wrapper.type()).toBe("svg");
  });

  it("ArrowRight exists", () => {
    const wrapper = shallow(<Slash />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Twitter exists", () => {
    const wrapper = shallow(<Twitter />);

    expect(wrapper.type()).toBe("svg");
  });

  it("UserAvatar exists", () => {
    const wrapper = shallow(<UserAvatar />);

    expect(wrapper.type()).toBe("svg");
  });

  it("X exists", () => {
    const wrapper = shallow(<X />);

    expect(wrapper.type()).toBe("svg");
  });

  it("LoadingIndicator exists", () => {
    const wrapper = shallow(<LoadingIndicator />);

    expect(wrapper.type()).toBe("svg");
  });
});
