import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import ArrowLeft from "app/components/icons/ArrowLeft";
import ArrowRight from "app/components/icons/ArrowRight";
import Check from "app/components/icons/Check";
import Chevron from "app/components/icons/Chevron";
import DifficultyEasy from "app/components/icons/DifficultyEasy";
import DifficultyHard from "app/components/icons/DifficultyHard";
import DifficultyMedium from "app/components/icons/DifficultyMedium";
import Exclamation from "app/components/icons/Exclamation";
import Github from "app/components/icons/Github";
import Home from "app/components/icons/Home";
import LightBulb from "app/components/icons/LightBulb";
import Reset from "app/components/icons/Reset";
import Save from "app/components/icons/Save";
import Trash from "app/components/icons/Trash";
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

  it("ArrowLeft exists", () => {
    const wrapper = shallow(<ArrowLeft />);

    expect(wrapper.type()).toBe("svg");
  });

  it("ArrowRight exists", () => {
    const wrapper = shallow(<ArrowRight />);

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

  it("DifficultyEasy exists", () => {
    const wrapper = shallow(<DifficultyEasy />);

    expect(wrapper.type()).toBe("svg");
  });

  it("DifficultyHard exists", () => {
    const wrapper = shallow(<DifficultyHard />);

    expect(wrapper.type()).toBe("svg");
  });

  it("DifficultyMedium exists", () => {
    const wrapper = shallow(<DifficultyMedium />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Exclamation exists", () => {
    const wrapper = shallow(<Exclamation />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Github exists", () => {
    const wrapper = shallow(<Github />);

    expect(wrapper.type()).toBe("svg");
  });

  it("Home exists", () => {
    const wrapper = shallow(<Home />);

    expect(wrapper.type()).toBe("svg");
  });

  it("LightBulb exists", () => {
    const wrapper = shallow(<LightBulb />);

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

  it("Trash exists", () => {
    const wrapper = shallow(<Trash />);

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
});
