import Layout from "app/app/layout";
import { JSDOM } from "jsdom";
import React from "react";
import { renderToString } from "react-dom/server";

describe("Root Layout", () => {
  it("renders children", async () => {
    /* eslint-disable-next-line testing-library/render-result-naming-convention */
    const html = renderToString(
      <Layout>
        <div id="child" />
      </Layout>,
    );

    const dom = new JSDOM(html);

    expect(dom.window.document.getElementById("chid")).not.toBeTruthy();
  });
});
