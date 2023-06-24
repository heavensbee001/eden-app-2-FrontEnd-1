import { render } from "@testing-library/react";

import { EdenTooltip } from ".";

describe("EdenTooltip", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <EdenTooltip
        id="elem1"
        place="top"
        effect="solid"
        backgroundColor="white"
        border
        borderColor="#e5e7eb"
        padding="0.5rem"
        innerTsx={
          <div className="w-60">
            <span className="text-gray-600">Tooltip inner tsx</span>
          </div>
        }
      >
        <p>Parent element</p>
      </EdenTooltip>
    );

    expect(container).toBeInTheDocument();
  });
});
