import { render } from "@testing-library/react";

import { ProgressCircle } from ".";

describe("ProgressCircle", () => {
  it("renders without throwing", () => {
    Element.prototype.scrollIntoView = jest.fn();
    const { container } = render(<ProgressCircle progress={50} />);

    expect(container).toBeInTheDocument();
  });
});
