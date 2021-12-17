import { fireEvent, render, screen } from "@testing-library/react";
import TextInput from "app/components/common/inputs/TextInput";
import React from "react";

describe("text input", () => {
  const labelText = "label";
  it("renders the label", () => {
    render(<TextInput label={labelText} />);

    expect(screen.getByLabelText(labelText)).toBeInTheDocument();
  });

  it("renders the value", () => {
    render(<TextInput label={labelText} value="value" />);

    expect(screen.getByLabelText(labelText)).toHaveValue("value");
  });

  it("renders a input of the passed type", () => {
    const type = "text";
    render(<TextInput label={labelText} type={type} />);

    expect(screen.getByLabelText(labelText)).toHaveAttribute("type", type);
  });

  it("renders the placeholder", () => {
    render(<TextInput label={labelText} placeholder="placeholder" />);

    expect(screen.getByLabelText(labelText)).toHaveAttribute("placeholder", "placeholder");
  });

  it("calls the onChange handler when the input changes", async () => {
    const onChange = jest.fn();
    render(<TextInput label={labelText} onChange={onChange} />);

    const input = screen.getByLabelText(labelText);
    fireEvent.change(input, { target: { value: "value" } });

    expect(onChange).toHaveBeenCalled();
  });

  it("renders the helper text", () => {
    render(<TextInput label={labelText} helperText="helper text" />);

    expect(screen.getByText("helper text")).toBeInTheDocument();
  });

  it("renders the input in the error state", () => {
    render(<TextInput label={labelText} helperText="helper text" error />);

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("passes the input ref to the input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TextInput label={labelText} inputRef={ref} />);

    expect(ref.current).toBeInTheDocument();
  });
});
