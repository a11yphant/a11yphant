import { render, screen } from "@testing-library/react";
import { HintReminderMessage } from "app/components/common/flashMessage/messages/HintReminderMessage";
import React from "react";

describe("HintReminderMessage", () => {
  it("renders hint reminder message", () => {
    render(<HintReminderMessage />);

    expect(screen.getByText(/Reminder: You can use hints if you are stuck/)).toBeInTheDocument();
  });
});
