import { MockedProvider } from "@apollo/client/testing";
import { getMember } from "@eden/package-mock";
import { render } from "@testing-library/react";

import { CandidateInfoTestSearchAlgo } from "./CandidateInfoTestSearchAlgo";

describe("CandidateInfoTestSearchAlgo", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <MockedProvider>
        <CandidateInfoTestSearchAlgo member={getMember()} />
      </MockedProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
