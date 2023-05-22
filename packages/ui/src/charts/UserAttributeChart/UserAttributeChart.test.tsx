import { render } from "@testing-library/react";

import { UserAttributeChart } from ".";
import { mockPositionData } from "./mockData";

describe("UserAttributeChart", () => {
  it("renders without throwing an error", () => {
    const { container } = render(
      <UserAttributeChart positions={mockPositionData} />
    );

    expect(container).toBeInTheDocument();
  });
});
