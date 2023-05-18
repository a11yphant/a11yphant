import Editor from "@monaco-editor/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import { EditorLanguage } from "app/components/challenge/Editors";
import React from "react";

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return {};
  },
}));

jest.mock("@monaco-editor/react", () => ({
  __esModule: true,
  default: jest.fn(),
  useMonaco: jest.fn(),
}));

const editorConfig: EditorConfig = {
  heading: "HTML Editor",
  languageLabel: "HTML",
  language: EditorLanguage.html,
  code: "<html></html>",
  updateCode: jest.fn(),
};

beforeEach(() => {
  Object.defineProperty(navigator, "platform", {
    value: undefined,
    writable: true,
  });

  (Editor as unknown as jest.Mock).mockImplementation(() => <></>);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("WrappedEditor", () => {
  it("renders heading", () => {
    render(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(screen.getByRole("heading", { name: editorConfig.heading })).toBeInTheDocument();
  });

  it("renders editor", async () => {
    render(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(Editor).toHaveBeenCalledWith(
      expect.objectContaining({
        language: editorConfig.language,
        value: editorConfig.code,
      }),
      expect.anything(),
    );
  });

  it("reset button opens modal", async () => {
    render(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("reset is called after button click", async () => {
    const reset = jest.fn();
    render(<WrappedEditor onReset={reset} config={editorConfig} />);

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));
    await userEvent.click(screen.getByRole("button", { name: "Reset HTML" }));

    expect(reset).toHaveBeenCalled();
  });

  it("uses the windows keys as a fallback for the tab management hint", async () => {
    render(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(screen.getByText("ctrl + m")).toBeInTheDocument();
  });

  it("shows the correct tab management keys for mac os", async () => {
    Object.defineProperty(navigator, "platform", {
      value: "MacIntel",
      writable: true,
    });

    render(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(screen.getByText("ctrl + shift + m")).toBeInTheDocument();
  });

  it("shows the correct tab management keys for platforms other than mac os", async () => {
    Object.defineProperty(navigator, "platform", {
      value: "Win",
      writable: true,
    });

    render(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(screen.getByText("ctrl + m")).toBeInTheDocument();
  });
});
