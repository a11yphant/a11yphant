import Button from "app/components/buttons/Button";
import ErrorDialog from "app/components/common/error/ErrorDialog";
import { Modal } from "app/components/modal/Modal";
import { ModalTitle } from "app/components/modal/ModalTitle";
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
  jest.resetAllMocks();
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV }; // Make a copy
  mockOnClose = jest.fn();
});

afterAll(() => {
  process.env = OLD_ENV; // Restore old environment
});

describe("Error Dialog", () => {
  it("passes the 'closed' state to the modal", () => {
    const wrapper = shallow(
      <ErrorDialog open={false} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    expect(wrapper.find(Modal).props().open).toBeFalsy();
  });

  it("passes the 'open' state to the modal", () => {
    const wrapper = shallow(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    expect(wrapper.find(Modal).props().open).toBeTruthy();
  });

  it("renders the title", () => {
    const wrapper = shallow(
      <ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />,
    );

    expect(
      wrapper
        .find(ModalTitle)
        .children()
        .findWhere((n) => n.text() === mockTitle)
        .getElements()
        .filter((n) => n).length,
    ).toBe(1);
  });

  it("renders the error messages", () => {
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

  it("renders the original error in development mode", async () => {
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
    expect(console.error).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("renders no original error in production mode", () => {
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

  it("calls onClose on button press", () => {
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

  it("calls onClose in onClose of modal", () => {
    const wrapper = shallow(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} />);

    wrapper.find(Modal).props().onClose();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
