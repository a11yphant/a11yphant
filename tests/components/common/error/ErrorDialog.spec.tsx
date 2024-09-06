import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorDialog from "app/components/common/error/ErrorDialog";
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
    render(<ErrorDialog open={false} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("passes the 'open' state to the modal", () => {
    render(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />);

    expect(screen.getByRole("heading", { level: 2, name: mockTitle })).toBeInTheDocument();
  });

  it("renders the error messages", () => {
    render(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />);

    expect(screen.getByRole("list")).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);

    expect(listItems.find((item) => item.textContent == mockMessages[0])).toBeInTheDocument();
    expect(listItems.find((item) => item.textContent == mockMessages[1])).toBeInTheDocument();
  });

  it("renders the original error in development mode", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_ENV = "development";
    console.error = jest.fn();

    render(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />);

    expect(screen.getByText("Original Error was logged to console (only in development mode)")).toBeInTheDocument();

    // Greater than or equal because findWhere also finds parents elements containing this text
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("renders no original error in production mode", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignoresrc/tests/components/modal/LoginModal.spec.tsx
    process.env.NODE_ENV = "production";
    console.error = jest.fn();

    render(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />);

    expect(screen.queryByText("Original Error was logged to console (only in development mode)")).not.toBeInTheDocument();
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it("calls onClose on button press", async () => {
    render(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} errorResponse={mockErrorResponse} />);

    await userEvent.click(screen.getByRole("button", { name: "Okay" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when closing the modal", async () => {
    render(<ErrorDialog open={true} title={mockTitle} messages={mockMessages} onClose={mockOnClose} />);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
