import { render, screen } from "@testing-library/react";
import { EditorConfig } from "app/components/challenge/editor/WrappedEditor";
import Editors, { EditorLanguage } from "app/components/challenge/Editors";
import React from "react";

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

describe("Editors", () => {
  it("renders the wrapper element with classes", () => {
    const { container } = render(<Editors className={mockClassName} editors={[htmlEditorConfig]} onReset={handleReset} />);

    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector(`div.${mockClassName}`)).toBeInTheDocument();
  });

  it("can render a single editor", () => {
    render(<Editors className={mockClassName} editors={[htmlEditorConfig]} onReset={handleReset} />);

    // this fails if multiple h3 are present
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("can render multiple editors", () => {
    render(<Editors className={mockClassName} editors={[htmlEditorConfig, cssEditorConfig]} onReset={handleReset} />);

    expect(screen.getByRole("heading", { level: 3, name: "HTML Editor" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "CSS Editor" })).toBeInTheDocument();
  });
});
