import SmallScreenNotification from "app/components/common/SmallScreenNotification";
import IllustrationCodingMan from "app/components/icons/IllustrationCodingMan";
import { shallow } from "enzyme";
import Link from "next/link";

const mockHeading = "Your device is too small";
const mockText = "Please use a tablet or desktop device with a larger screen or rotate your device.";

describe("Small Screen Notification", () => {
  it("renders wrapper element", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.exists("section")).toBeTruthy();
  });
  it("renders a heading", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.exists("h2")).toBeTruthy();
    expect(wrapper.find("h2").text()).toBe(mockHeading);
  });

  it("renders the description text", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.exists("p")).toBeTruthy();
    expect(wrapper.find("p").text()).toBe(mockText);
  });

  it("renders a link", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.exists(Link)).toBeTruthy();
  });

  it("renders the illustration svg", () => {
    const wrapper = shallow(<SmallScreenNotification />);

    expect(wrapper.exists(IllustrationCodingMan)).toBeTruthy();
  });
});
