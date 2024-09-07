import Document from "app/pages/_document";
import React from "react";

describe("custom document", () => {
  it("renders", () => {
    expect(() => <Document />).not.toThrow();
  });
});
