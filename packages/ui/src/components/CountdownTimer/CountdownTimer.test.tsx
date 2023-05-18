import { render } from "@testing-library/react";

import { CountdownTimer } from ".";

describe("CountdownTimer", () => {
  it("renders without throwing", () => {
    Element.prototype.scrollIntoView = jest.fn();
    const { container } = render(<CountdownTimer />);

    expect(container).toBeInTheDocument();
  });
});
