import "@testing-library/jest-dom/extend-expect";

import { render } from "@testing-library/react";
import Home from "app/pages";

// const mocks: MockedResponse[] = [
//   {
//     request: {
//       query: HelloWorldDocument,
//     },
//     result: {
//       data: {
//         helloWorld: [
//           {
//             id: "f0a71757-3e7d-4a88-988e-17d857e547a1",
//             message: "Hello",
//           },
//           {
//             id: "959b4d8f-77bb-4f55-a84d-1765630b0979",
//             message: "World",
//           },
//         ],
//       },
//     },
//   },
// ];

describe("Home", () => {
  it("renders without crashing", () => {
    render(<Home />);

    // TODO: define what should be tested here
    // expect(screen.getByText("A11y Challenges")).toBeInTheDocument();
  });
});
