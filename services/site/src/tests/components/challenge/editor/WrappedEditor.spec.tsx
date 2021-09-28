import Editor from "@monaco-editor/react";
import { cleanup } from "@testing-library/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import { EditorLanguage } from "app/components/challenge/Editors";
import Reset from "app/components/icons/Reset";
import ConfirmationModal from "app/components/modal/ConfirmationModal";
import { setupIntersectionObserverMock } from "app/lib/test-helpers/setupIntersectionObserverMock";
import { mount, shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

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

  it("reset is called", () => {
    setupIntersectionObserverMock();

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
});
