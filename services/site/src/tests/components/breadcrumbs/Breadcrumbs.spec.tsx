import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";

//@TODO: fix mocking of dependencies

// const challengeSlug = "challenge-1";
// const expectedBreadcrumbHome = {
//   href: "/",
//   breadcrumb: "Home",
// };
// const expectedBreadcrumbChallenge = {
//   href: `/challenge/${challengeSlug}`,
//   breadcrumb: "Challenge 1",
// };
//
// const mocks: MockedResponse[] = [
//   {
//     request: {
//       query: BreadcrumbChallengeDocument,
//       variables: {
//         slug: challengeSlug,
//       },
//     },
//     result: {
//       data: {
//         challenge: {
//           id: "242003d6-402e-49b7-9ec2-702445b37c8e",
//           name: expectedBreadcrumbChallenge.breadcrumb,
//         },
//       },
//     },
//   },
// ];
//
// const mockedHomeRoute: RouteInfo = {
//   getBreadcrumbInfo: jest.fn(async () => {
//     return expectedBreadcrumbHome;
//   }),
// };
//
// const mockedChallengeRoute: RouteInfo = {
//   getBreadcrumbInfo: jest.fn(async (urlParams, apolloClient) => {
//     const { challengeSlug } = urlParams;
//
//     const { data } = await apolloClient.query<BreadcrumbChallengeQuery, BreadcrumbChallengeQueryVariables>({
//       query: BreadcrumbChallengeDocument,
//       variables: { slug: challengeSlug as string },
//     });
//
//     return {
//       href: `/challenge/${challengeSlug}`,
//       breadcrumb: data.challenge?.name,
//     };
//   }),
// };
//
// const mockedRoutes: Routes = {
//   "/": mockedHomeRoute,
//   "/challenge/[challengeSlug]": mockedChallengeRoute,
// };
//
// const mockUseRoutesFn = jest.fn(() => mockedRoutes);
//
// export const useRoutes = mockUseRoutesFn;
//
// jest.mock("app/components/breadcrumbs/routes");
//
// jest.mock("next/router", () => ({
//   useRouter() {
//     return {
//       pathname: `/challenge/${challengeSlug}`,
//       query: { challengeSlug: challengeSlug },
//     };
//   },
// }));

afterEach(cleanup);

describe("Breadcrumbs", () => {
  it("renders correctly", () => {
    //   const container = document.createElement("div");
    //   document.body.appendChild(container);
    //
    //   act(() => {
    //     render(
    //       <MockedProvider mocks={mocks} addTypename={false}>
    //         <Breadcrumbs />
    //       </MockedProvider>,
    //     );
    //   });
    //
    //   // expect(screen.queryByRole("navigation")).toBeTruthy();
    //   // expect(screen.queryByRole("list")).toBeTruthy();
    //   // expect(container.querySelectorAll("li")).toHaveProperty("length", 2);
    //   // // Test for Slash
    //   // expect(container.querySelectorAll("svg")).toHaveProperty("length", 1);
    //   //
    //   // // Breadcrumb Home
    //   // expect(container.querySelectorAll("span")).toHaveProperty("length", 1);
    //   // expect(screen.getByText(expectedBreadcrumbHome.breadcrumb).closest("a")).toHaveAttribute("href", expectedBreadcrumbHome.href);
    //   //
    //   // // Breadcrumb Challenge
    //   // expect(screen.getByText(expectedBreadcrumbChallenge.breadcrumb).closest("a")).toHaveAttribute("href", expectedBreadcrumbChallenge.href);
  });
});
