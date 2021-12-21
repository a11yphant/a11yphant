import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import NextLink, { LinkProps } from "next/link";
import React from "react";

const WrappedNextLink: React.FC<LinkProps & { className: string }> = ({ href, children, ...rest }) => (
  <NextLink href={href}>
    <a {...rest}>{children}</a>
  </NextLink>
);

type LinkComponent = React.FC<LinkProps>;
const Link: LinkComponent = ({ children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <WrappedNextLink
        className={clsx(
          "p-3 w-full block text-center font-normal leading-6 border-none motion-safe:transition transition-300 underline decoration-2 underline-offset-4",
          !active && "text-light decoration-transparent",
          active && "text-primary-light hover:text-primary-light decoration-primary-light",
        )}
        {...props}
      >
        {children}
      </WrappedNextLink>
    )}
  </Menu.Item>
);

type GroupComponent = React.FC;
export const Group: GroupComponent = ({ children }) => <div className="my-3 mx-10">{children}</div>;

interface ButtonProps {
  onClick?: () => void;
}

type ButtonComponent = React.FC<ButtonProps>;
const Button: ButtonComponent = ({ children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={clsx(
          "text-center w-full leading-6 p-3 motion-safe:transition transition-300 underline decoration-2 underline-offset-4",
          !active && "decoration-transparent",
          active && "text-primary-light decoration-primary-light",
        )}
        {...props}
      >
        {children}
      </button>
    )}
  </Menu.Item>
);

interface TriggerButtonProps {
  className?: string;
}

type TriggerButtonComponent = React.FC<TriggerButtonProps>;
const TriggerButton: TriggerButtonComponent = ({ children, ...props }) => <Menu.Button {...props}>{children}</Menu.Button>;

interface DropdownProps {
  triggerButton: React.ReactElement;
}

type DropdownComponent = React.FC<DropdownProps> & {
  Link: LinkComponent;
  Button: ButtonComponent;
  TriggerButton: TriggerButtonComponent;
  Group: GroupComponent;
};

const Dropdown: DropdownComponent = ({ children, triggerButton }) => {
  return (
    <Menu as="div" className="relative inline-block">
      {triggerButton}
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100 motion-reduce:transition-none"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75 motion-reduce:transition-none"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            "absolute right-0 w-56 mt-2 origin-top-right",
            "bg-background-light rounded-md shadow-card divide-grey-dark divide-y",
            "focus:outline-none",
          )}
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

Dropdown.Button = Button;
Dropdown.Group = Group;
Dropdown.Link = Link;
Dropdown.TriggerButton = TriggerButton;

export default Dropdown;
