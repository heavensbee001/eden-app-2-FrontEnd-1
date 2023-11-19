import { MockedProvider } from "@apollo/client/testing";
import { getMember } from "@eden/package-mock";
import { render } from "@testing-library/react";

import { CandidateInfoNew } from "./CandidateInfoNew";

describe("CandidateInfoNew", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <MockedProvider>
        <CandidateInfoNew member={getMember()} />
      </MockedProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
