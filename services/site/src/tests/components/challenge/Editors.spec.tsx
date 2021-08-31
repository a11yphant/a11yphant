import { cleanup } from "@testing-library/react";
import WrappedEditor, { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

const mockClassName = "test-class";

const htmlEditorConfig: EditorConfig = {
  heading: "HTML Editor",
  languageLabel: "HTML",
  language: EditorLanguage.html,
  code: "<html></html>",
  updateCode: jest.fn(),
};

const cssEditorConfig: EditorConfig = {
  heading: "CSS Editor",
  languageLabel: "CSS",
  language: EditorLanguage.css,
  code: "body{}",
  updateCode: jest.fn(),
};

const handleReset = jest.fn();

describe("WrappedEditor", () => {
  it("renders wrapper div with class", () => {
    const wrapper = shallow(<Editors className={mockClassName} editors={[htmlEditorConfig]} onReset={handleReset} />);

    expect(wrapper.exists("div")).toBeTruthy();
    expect(wrapper.find("div").first().props().className).toContain(mockClassName);
  });

  it("renders one editor", () => {
    const wrapper = shallow(<Editors className={mockClassName} editors={[htmlEditorConfig]} onReset={handleReset} />);

    expect(wrapper.find(WrappedEditor).length).toBe(1);
  });

  it("renders multiple editors", () => {
    const wrapper = shallow(<Editors className={mockClassName} editors={[htmlEditorConfig, cssEditorConfig]} onReset={handleReset} />);

    expect(wrapper.find(WrappedEditor).length).toBe(2);
  });
});
