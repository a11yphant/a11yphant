import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import NextLink, { LinkProps } from "next/link";
import React from "react";

const WrappedNextLink: React.FC<LinkProps & { className: string }> = ({ href, children, ...rest }) => (
  <NextLink href={href}>
    <a {...rest}>{children}</a>
  </NextLink>
);

export const Link: React.FC<LinkProps> = ({ children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <WrappedNextLink
        className={clsx(
          "p-3 w-full block text-center font-normal leading-6 border-none transition-none",
          active && "text-primary-light hover:text-primary-light underline-offset-4 decoration-2 decoration-blink underline",
          !active && "text-light",
        )}
        {...props}
      >
        {children}
      </WrappedNextLink>
    )}
  </Menu.Item>
);

export const Group: React.FC = ({ children }) => <div className="my-3 mx-10">{children}</div>;

interface ButtonProps {
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={clsx(
          "text-center w-full leading-6 p-3",
          active && "text-primary-light underline-offset-4 decoration-2 decoration-blink underline",
        )}
        {...props}
      >
        {children}
      </button>
    )}
  </Menu.Item>
);

export const TriggerButton: React.FC = ({ children }) => <Menu.Button className="">{children}</Menu.Button>;

interface DropdownProps {
  triggerButton: React.ReactElement;
}

const Dropdown: React.FC<DropdownProps> = ({ children, triggerButton }) => {
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

export default Dropdown;
