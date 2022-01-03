import "@testing-library/jest-dom/extend-expect";

// import { MockedResponse } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import Footer from "app/components/Footer";
import ChallengeHeader from "app/components/homepage/ChallengeHeader";
import Legend from "app/components/homepage/Legend";
// import { ChallengesDocument } from "app/generated/graphql";
import React from "react";

// const mocks: MockedResponse[] = [
//   {
//     request: {
//       query: ChallengesDocument,
//     },
//     result: {
//       data: {
//         challenges: [
//           {
//             id: "28a5117b-84d7-43d7-a5fb-58b4db507e0a",
//             slug: "semantic-html",
//             name: "Semantic HTML",
//             levels: [
//               {
//                 id: "f0a71757-3e7d-4a88-988e-17d857e547a1",
//               },
//               {
//                 id: "959b4d8f-77bb-4f55-a84d-1765630b0979",
//               },
//             ],
//           },
//         ],
//       },
//     },
//   },
// ];

describe("Home", () => {
  it("renders without crashing", () => {
    // render(<Navigation />);
    render(<ChallengeHeader />);
    render(<Legend />);
    // render(<ChallengeList />);
    // render(<ChallengeModal />);
    render(<Footer />);

    // TODO: define what should be tested here
    // expect(screen.getByText("A11y Challenges")).toBeInTheDocument();
  });
});
