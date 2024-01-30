import { MockedProvider } from "@apollo/client/testing";
import { DynamicSessionProvider } from "@eden/package-context";
import { FIND_MEMBER } from "@eden/package-graphql";
import { render } from "@testing-library/react";

import { AppHeader } from "./";
jest.mock("next/router", () => require("next-router-mock"));

const mocks = [
  {
    request: {
      query: FIND_MEMBER,
      variables: {
        _id: "1",
      },
    },
    result: {
      data: {
        findMember: {
          _id: "1",
          discordName: "Miral",
          emailAddress: "miralsuthar@gmail.com",
        },
      },
    },
  },
];

describe("AppHeader", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <DynamicSessionProvider fetchingToken={false}>
        <MockedProvider mocks={mocks}>
          <AppHeader />
        </MockedProvider>
      </DynamicSessionProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
