import { fireEvent, render, screen } from "@testing-library/react";
import TextInput from "app/components/common/inputs/TextInput";
import React from "react";

describe("text input", () => {
  it("renders the label", () => {
    render(<TextInput label="label" />);

    expect(screen.getByLabelText("label")).toBeInTheDocument();
  });

  it("renders the value", () => {
    render(<TextInput label="label" value="value" />);

    expect(screen.getByLabelText("label")).toHaveValue("value");
  });

  it("renders a input of the passed type", () => {
    render(<TextInput label="label" type="text" />);

    expect(screen.getByLabelText("label")).toHaveAttribute("type", "text");
  });

  it("renders the placeholder", () => {
    render(<TextInput label="label" placeholder="placeholder" />);

    expect(screen.getByLabelText("label")).toHaveAttribute("placeholder", "placeholder");
  });

  it("calls the onChange handler when the input changes", async () => {
    const onChange = jest.fn();
    render(<TextInput label="label" onChange={onChange} />);

    const input = screen.getByLabelText("label");
    fireEvent.change(input, { target: { value: "value" } });

    expect(onChange).toHaveBeenCalled();
  });

  it("renders the helper text", () => {
    render(<TextInput label="label" helperText="helper text" />);

    expect(screen.getByText("helper text")).toBeInTheDocument();
  });

  it("renders the input in the error state", () => {
    render(<TextInput label="label" helperText="helper text" error />);

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("passes the input ref to the input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TextInput label="label" inputRef={ref} />);

    expect(ref.current).toBeInTheDocument();
  });
});
