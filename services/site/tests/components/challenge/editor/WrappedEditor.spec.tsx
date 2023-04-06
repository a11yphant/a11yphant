import Editor from "@monaco-editor/react";
import { act, render, screen } from "@testing-library/react";
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

  (Editor as jest.Mock).mockImplementation(() => <></>);
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

    // needed to wait for modal transition to be finished
    // headless ui sets state during the trasition hence the act is needed
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Reset" }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("reset is called after button click", async () => {
    const reset = jest.fn();
    render(<WrappedEditor onReset={reset} config={editorConfig} />);

    // needed to wait for modal transition to be finished
    // headless ui sets state during the trasition hence the act is needed
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Reset" }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Reset HTML" }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

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
