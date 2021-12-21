import Editor from "@monaco-editor/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import { EditorLanguage } from "app/components/challenge/Editors";
import Reset from "app/components/icons/Reset";
import ConfirmationModal from "app/components/modal/ConfirmationModal";
import { mount, shallow } from "enzyme";
import React from "react";

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
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

  it("reset button opens modal", () => {
    const wrapper = mount(
      <WrappedEditor
        onReset={() => {
          return;
        }}
        config={editorConfig}
      />,
    );

    expect(wrapper.find(Reset).closest("button")).toBeTruthy();
    wrapper.find(Reset).closest("button").simulate("click");
    expect(wrapper.find(ConfirmationModal).props().open).toBeTruthy();
  });

  it("reset is called after button click", () => {
    const onReset = jest.fn();
    const wrapper = mount(<WrappedEditor onReset={onReset} config={editorConfig} />);

    wrapper.find(Reset).simulate("click");
    wrapper
      .findWhere((n) => n.text() === `Reset ${editorConfig.languageLabel}`)
      .find("button")
      .simulate("click");

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledWith(editorConfig.language);
  });

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
