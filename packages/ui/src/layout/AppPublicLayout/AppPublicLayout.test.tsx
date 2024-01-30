// import { render } from "@testing-library/react";
import { DynamicSessionProvider } from "@eden/package-context";

import { render } from "../../../utils/jest-apollo";
import { AppPublicLayout } from "./";
jest.mock("next/router", () => require("next-router-mock"));

describe("AppPublicLayout", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <DynamicSessionProvider fetchingToken={false}>
        <AppPublicLayout>children here</AppPublicLayout>
      </DynamicSessionProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
