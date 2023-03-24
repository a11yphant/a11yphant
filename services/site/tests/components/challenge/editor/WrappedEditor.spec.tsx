import Editor from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import { EditorLanguage } from "app/components/challenge/Editors";
import { shallow } from "enzyme";
import React from "react";

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return {};
  },
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
});

describe("WrappedEditor", () => {
  it("renders heading", () => {
    const wrapper = shallow(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(wrapper.find("h3").text()).toBe(editorConfig.heading);
  });

  it("renders editor", () => {
    const wrapper = shallow(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(wrapper.exists(Editor));

    expect(wrapper.find(Editor).props().language).toBe(editorConfig.language);
    expect(wrapper.find(Editor).props().value).toBe(editorConfig.code);
  });

  it.todo("reset button opens modal");
  // it("reset button opens modal", () => {
  //   const wrapper = mount(
  //     <WrappedEditor
  //       onReset={() => {
  //         return;
  //       }}
  //       config={editorConfig}
  //     />,
  //   );

  //   expect(wrapper.find(Reset).closest("button")).toBeTruthy();
  //   wrapper.find(Reset).closest("button").simulate("click");
  //   expect(wrapper.find(ConfirmationModal).props().open).toBeTruthy();
  // });

  it.todo("reset is called after button click");

  it("uses the windows keys as a fallback for the tab management hint", async () => {
    const wrapper = shallow(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(wrapper.find("span.text-grey-middle").text()).toContain("ctrl + m");
  });

  it("shows the correct tab management keys for mac os", async () => {
    Object.defineProperty(navigator, "platform", {
      value: "MacIntel",
      writable: true,
    });

    const wrapper = shallow(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(wrapper.find("span.text-grey-middle").text()).toContain("ctrl + shift + m");
  });

  it("shows the correct tab management keys for platforms other than mac os", async () => {
    Object.defineProperty(navigator, "platform", {
      value: "Win",
      writable: true,
    });

    const wrapper = shallow(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(wrapper.find("span.text-grey-middle").text()).toContain("ctrl + m");
  });
});
