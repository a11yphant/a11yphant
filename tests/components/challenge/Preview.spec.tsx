import { act, render, screen } from "@testing-library/react";
import Preview from "app/components/challenge/Preview";
import React from "react";

const mockHtmlCode = "<h1>Mock Html</h1>";
const mockCssCode = ".h1 {color: red;}";
const mockJsCode = "const mockFunc = () => {}";

const mockHeading = "Mock Heading";

describe("Preview", () => {
  it("renders the wrapper element with classes", () => {
    jest.useFakeTimers();
    const mockClassName = "test-class";

    const { container } = render(
      <Preview className={mockClassName} htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />,
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector(`.${mockClassName}`)).toBeInTheDocument();
  });

  it("renders heading", () => {
    jest.useFakeTimers();
    render(<Preview htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading="Mock Heading" />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByRole("heading", { level: 3, name: /Mock Heading/ })).toBeInTheDocument();
  });

  it("renders code in iframe", async () => {
    jest.useFakeTimers();
    const { container } = render(<Preview htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const iframeSrc = container.querySelector("iframe").getAttribute("srcDoc");

    expect(iframeSrc).toContain(mockHtmlCode);
    expect(iframeSrc).toContain(mockCssCode);
    expect(iframeSrc).toContain(mockJsCode);
  });

  it("renders base font in iFrame", async () => {
    jest.useFakeTimers();
    const { container } = render(<Preview htmlCode={mockHtmlCode} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const iframeSrc = container.querySelector("iframe").getAttribute("srcDoc");

    expect(iframeSrc).toContain('body {\n    font-family: "Courier", "Arial", sans-serif;\n  }');
  });

  it('renders all anchor tags with target="_blank" inside the iFrame', async () => {
    jest.useFakeTimers();
    const mockHtmlCodeWithATag = "<a href='https://www.google.at/'>Google</a>";

    const { container } = render(<Preview htmlCode={mockHtmlCodeWithATag} cssCode={mockCssCode} javascriptCode={mockJsCode} heading={mockHeading} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const iframeSrc = container.querySelector("iframe").getAttribute("srcDoc");

    expect(iframeSrc).toMatch(/(<a).*(target="_blank").*(>Google<\/a>)/g);
  });

  it("renders title in preview heading", () => {
    jest.useFakeTimers();
    const mockCodeWithTitle = `<head><title>MockTitle</title></head>`;

    render(<Preview cssCode={""} htmlCode={mockCodeWithTitle} javascriptCode={""} heading={""} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByRole("heading", { name: /MockTitle/ })).toBeInTheDocument();
  });
});
