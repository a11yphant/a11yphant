import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import router from "next/router";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(cleanup);

const mockChallengeSlug = "mock-slug";
const mockNthLevel = 2;
// const defaultCode = {
//     html: "html",
//     css: "css",
//     js: "js",
//   };
// const mockChallengeName = "HTML Basics";
// const mockLevel = [
//   {
//     id: "1",
//     instructions: "This is a instruction.",
//     tasks: "This is the first task.",
//   },
// ];

beforeEach(() => {
  router.query = { challengeSlug: mockChallengeSlug, nthLevel: String(mockNthLevel) };
  router.back = jest.fn();
});

describe("Code Level", () => {
  it("renders sidebar", () => {
    // const wrapper = shallow(<CodeLevel challengeName={mockChallengeName} level={mockLevel} onAutoSaveLoadingChange={true} />);
    // expect(wrapper.find(Sidebar).length).toBe(1);
    return;
  });

  // it("renders section", () => {
  //     expect(wrapper.find("section").length).toBe(1);
  // });

  //   it("renders all editors", () => {});

  //   it("renders only one editor", () => {});

  //   it("renders only two editor", () => {});

  //   it("renders preview", () => {});

  //   it("renders submit button", () => {
  //     expect(wrapper.find(ButtonLoading).length).toBe(1);
  //   });
});
