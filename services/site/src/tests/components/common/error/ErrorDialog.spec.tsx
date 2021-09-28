import { Dialog } from "@headlessui/react";
import { cleanup } from "@testing-library/react";
import Button from "app/components/buttons/Button";
import ErrorDialog from "app/components/common/error/ErrorDialog";
import X from "app/components/icons/X";
import { setupIntersectionObserverMock } from "app/lib/test-helpers/setupIntersectionObserverMock";
import { mount, shallow } from "enzyme";
import { GraphQLError } from "graphql";
import React from "react";

// https://stackoverflow.com/a/48042799
const OLD_ENV = process.env;

const mockTitle = "Mocked Title";
const mockMessages = ["Mocked Message 1", "Mocked Message 2"];
let mockOnClose = jest.fn();
const mockGraphQLErrorMessage = "GraphQL Error Message";
const mockNetworkErrorMessage = "Network Error Message";
const mockErrorResponse = { graphQLErrors: [new GraphQLError(mockGraphQLErrorMessage)], networkError: new Error(mockNetworkErrorMessage) };

beforeEach(() => {
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV }; // Make a copy
  mockOnClose = jest.fn();
});

afterEach(cleanup);

afterAll(() => {
  process.env = OLD_ENV; // Restore old environment
});

describe("Error Dialog", () => {
  it("is closed", () => {
    const wrapper = shallow(
      <ErrorDialog open={false} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    expect(wrapper.find(Dialog).props().open).toBeFalsy();
  });

  it("is open", () => {
    const wrapper = shallow(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    expect(wrapper.find(Dialog).props().open).toBeTruthy();
  });

  it("shows title", () => {
    const wrapper = shallow(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    expect(wrapper.find(Dialog.Title).children().text()).toContain(mockTitle);
  });

  it("shows error messages", () => {
    const wrapper = shallow(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    expect(wrapper.find("ul").length).toBe(1);
    expect(wrapper.find("li").length).toBe(2);
    // findWhere returns null values for some reason. Can be avoided by using getElements and filter
    expect(
      wrapper
        .find("li")
        .findWhere((n) => n.text() === mockMessages[0])
        .getElements()
        .filter((n) => n).length,
    ).toBe(1);
    expect(
      wrapper
        .find("li")
        .findWhere((n) => n.text() === mockMessages[1])
        .getElements()
        .filter((n) => n).length,
    ).toBe(1);
  });

  it("shows original error in development mode", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_ENV = "development";
    console.error = jest.fn();

    const wrapper = mount(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    wrapper.update();

    // Greater than or equal because findWhere also finds parents elements containing this text
    expect(wrapper.find("div").findWhere((n) => n.text().includes("Original Error was logged to console")).length).toBeGreaterThanOrEqual(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("does not show original error in production mode", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignoresrc/tests/components/modal/LoginModal.spec.tsx
    process.env.NODE_ENV = "production";
    console.error = jest.fn();

    const wrapper = shallow(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );
    wrapper.update();

    expect(wrapper.find("div").findWhere((n) => n.text().includes("Original Error was logged to console")).length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it("calls onClose on Okay press", () => {
    setupIntersectionObserverMock();

    const wrapper = mount(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    wrapper
      .find(Button)
      .findWhere((n) => n.text() === "Okay")
      .first()
      .simulate("click");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on X press", () => {
    const wrapper = shallow(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} />);

    wrapper.find(X).closest(Button).simulate("click");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape press", () => {
    setupIntersectionObserverMock();

    const wrapper = mount(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );
    wrapper.update();

    const event = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("doesn't call onClose on Escape press after unmount", () => {
    setupIntersectionObserverMock();

    const wrapper = mount(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );
    wrapper.update();
    wrapper.unmount();

    const event = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);

    expect(mockOnClose).toHaveBeenCalledTimes(0);
  });
});
