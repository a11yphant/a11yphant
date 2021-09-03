import { cleanup } from "@testing-library/react";
import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import IllustrationCodingMan from "app/components/icons/IllustrationCodingMan";
import { shallow } from "enzyme";
import Link from "next/link";

afterEach(cleanup);

const mockHeading = "Your device is too small";
const mockText = "Please use a tablet or desktop device with a larger screen.";

describe("Small Screen Notification", () => {
  it("renders wrapper elements", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.find("section").length).toBe(1);
  });
  it("renders heading", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.find("h2").length).toBe(1);
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders description text", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.find("p").length).toBe(1);
    expect(wrapper.find("p").text()).toBe(mockText);
  });

  it("renders link", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.find(Link).length).toBe(1);
  });

  it("renders illustration", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.find(IllustrationCodingMan).length).toBe(1);
  });
});
