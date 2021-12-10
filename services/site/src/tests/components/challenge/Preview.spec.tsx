import { act, cleanup } from "@testing-library/react";
import Preview from "app/components/challenge/Preview";
import { mount, shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const mockHtmlCode = "<h1>Mock Html</h1>";
const mockCssCode = ".h1 {color: red;}";
const mockJsCode = "const mockFunc = () => {}";

const mockHeading = "Mock Heading";

describe("Preview", () => {
  it("renders the wrapper element with classes", () => {
    const mockClassName = "test-class";

    const wrapper = shallow(
      <Preview className={mockClassName} htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />,
    );

    expect(wrapper.find("div").first().props().className).toContain(mockClassName);
  });

  it("renders heading", () => {
    const wrapper = shallow(<Preview htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />);

    expect(wrapper.find("h3").text()).toBe(mockHeading);
  });

  it("renders code in iframe", async () => {
    jest.useFakeTimers();
    const wrapper = mount(<Preview htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />);

    await act(async () => {
      await Promise.resolve(wrapper);
      jest.runOnlyPendingTimers();
      wrapper.update();
    });

    // I didn't find a way to make enzyme render the content iframe
    // therefore I just check the content of srcDoc
    const iframeSrc = wrapper.find("iframe").props().srcDoc;

    expect(iframeSrc).toContain(mockHtmlCode);
    expect(iframeSrc).toContain(mockCssCode);
    expect(iframeSrc).toContain(mockJsCode);
  });

  it("renders base font in iFrame", async () => {
    jest.useFakeTimers();
    const wrapper = mount(<Preview htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />);

    await act(async () => {
      await Promise.resolve(wrapper);
      jest.runOnlyPendingTimers();
      wrapper.update();
    });

    const iframeSrc = wrapper.find("iframe").props().srcDoc;

    expect(iframeSrc).toContain('body {\n    font-family: "Courier", "Arial", sans-serif;\n  }');
  });

  it('renders a-tags with target="_blank" inside the iFrame per default', async () => {
    jest.useFakeTimers();
    const mockHtmlCodeWithATag = "<a href='https://www.google.at/'>Google</a>";

    const wrapper = mount(<Preview htmlCode={mockHtmlCodeWithATag} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />);

    await act(async () => {
      await Promise.resolve(wrapper);
      jest.runOnlyPendingTimers();
      wrapper.update();
    });

    const iframeSrc = wrapper.find("iframe").props().srcDoc;

    expect(iframeSrc).toMatch(/(<a).*(target="_blank").*(>Google<\/a>)/g);
  });
});
