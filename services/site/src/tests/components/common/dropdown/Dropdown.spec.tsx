import { render, screen } from "@testing-library/react";
import Dropdown, { Button, Group, Link, TriggerButton } from "app/components/common/dropdown/Dropdown";
import React from "react";

function renderAndOpenDropdown(children: React.ReactNode = <></>): void {
  render(<Dropdown triggerButton={<TriggerButton>Open</TriggerButton>}>{children}</Dropdown>);

  const triggerButton = screen.getByRole("button", { name: "Open" });
  triggerButton.click();
}

describe("dropdown", () => {
  it("renders the trigger button", () => {
    render(<Dropdown triggerButton={<TriggerButton>Trigger Button</TriggerButton>}></Dropdown>);

    expect(screen.getByRole("button", { name: "Trigger Button" })).toBeInTheDocument();
  });

  it("opens the modal when clicking the trigger button", async () => {
    renderAndOpenDropdown();

    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("renders the passed content in the dropdown", async () => {
    const content = "Text";
    renderAndOpenDropdown(<p>{content}</p>);

    expect(await screen.findByText(content)).toBeInTheDocument();
  });

  it("renders the button as a menuitem", async () => {
    const content = "button";
    renderAndOpenDropdown(<Button>{content}</Button>);

    expect(await screen.findByRole("menuitem", { name: content })).toBeInTheDocument();
  });

  it("renders the link as a menuitem", async () => {
    const content = "link";
    renderAndOpenDropdown(<Link href="/">{content}</Link>);

    expect(await screen.findByRole("menuitem", { name: content })).toBeInTheDocument();
  });

  it("renders items that are grouped together", async () => {
    const content = "group";
    renderAndOpenDropdown(
      <Group>
        <Button>{content}</Button>
        <Link href="/">{content}</Link>
      </Group>,
    );

    expect(await screen.findAllByRole("menuitem")).toHaveLength(2);
  });

  it("calls onClick when clicking on a menu item button", async () => {
    const onClick = jest.fn();
    renderAndOpenDropdown(<Button onClick={onClick}>Button</Button>);

    const button = await screen.findByRole("menuitem", { name: "Button" });
    button.click();

    expect(onClick).toHaveBeenCalled();
  });
});
