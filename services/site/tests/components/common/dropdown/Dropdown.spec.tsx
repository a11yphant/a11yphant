import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown from "app/components/common/dropdown/Dropdown";
import React from "react";

async function renderAndOpenDropdown(children: React.ReactNode = <></>): Promise<void> {
  render(<Dropdown triggerButton={<Dropdown.TriggerButton>Open</Dropdown.TriggerButton>}>{children}</Dropdown>);

  const button = screen.getByRole("button");
  await userEvent.click(button);
}

describe("dropdown", () => {
  it("renders the trigger button", () => {
    render(<Dropdown triggerButton={<Dropdown.TriggerButton>Trigger Button</Dropdown.TriggerButton>}></Dropdown>);

    expect(screen.getByRole("button", { name: "Trigger Button" })).toBeInTheDocument();
  });

  it("opens the modal when clicking the trigger button", async () => {
    await renderAndOpenDropdown();

    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("renders the passed content in the dropdown", async () => {
    const content = "Text";
    await renderAndOpenDropdown(<p>{content}</p>);

    expect(await screen.findByText(content)).toBeInTheDocument();
  });

  it("renders the button as a menuitem", async () => {
    const content = "button";
    await renderAndOpenDropdown(<Dropdown.Button>{content}</Dropdown.Button>);

    expect(await screen.findByRole("menuitem", { name: content })).toBeInTheDocument();
  });

  it("renders the link as a menuitem", async () => {
    const content = "link";
    await renderAndOpenDropdown(<Dropdown.Link href="/">{content}</Dropdown.Link>);

    expect(await screen.findByRole("menuitem", { name: content })).toBeInTheDocument();
  });

  it("renders items that are grouped together", async () => {
    const content = "group";
    await renderAndOpenDropdown(
      <Dropdown.Group>
        <Dropdown.Button>{content}</Dropdown.Button>
        <Dropdown.Link href="/">{content}</Dropdown.Link>
      </Dropdown.Group>,
    );

    expect(await screen.findAllByRole("menuitem")).toHaveLength(2);
  });

  it("calls onClick when clicking on a menu item button", async () => {
    const onClick = jest.fn();
    await renderAndOpenDropdown(<Dropdown.Button onClick={onClick}>Button</Dropdown.Button>);

    const button = await screen.findByRole("menuitem", { name: "Button" });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
