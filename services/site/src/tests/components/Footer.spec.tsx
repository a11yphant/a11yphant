import Footer from "app/components/Footer";
import { shallow } from "enzyme";

describe("footer", () => {
  it("renders a footer", () => {
    const footer = shallow(<Footer />);

    expect(footer.exists("footer")).toBeTruthy();
  });

  it("renders a navigation inside the footer", () => {
    const footer = shallow(<Footer />);

    expect(footer.exists("nav")).toBeTruthy();
  });
});
