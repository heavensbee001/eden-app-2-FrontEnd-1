import { render, screen } from "@testing-library/react";
import CutTextTooltip from "./CutTextTooltip";

describe("CutTextTooltip Component", () => {
  test("renders text and tooltip", () => {
    const text = "This is a long text that will be truncated";
    render(<CutTextTooltip text={text} />);

    const tooltipElement = screen.getByText(text);
    const tooltip = screen.getByTestId("tooltip");

    expect(tooltipElement).toBeInTheDocument();
    expect(tooltip).toBeInTheDocument();
  });

  test("tooltip is visible when text is truncated", () => {
    const text = "This is a long text that will be truncated";
    render(<CutTextTooltip text={text} />);

    const tooltip = screen.getByTestId("tooltip");

    expect(tooltip).toHaveClass("visible");
  });

  test("tooltip is not visible when text is not truncated", () => {
    const text = "Short Text";
    render(<CutTextTooltip text={text} />);

    const tooltip = screen.getByTestId("tooltip");

    expect(tooltip).not.toHaveClass("visible");
  });

  test("tooltip is not rendered when text is not provided", () => {
    render(<CutTextTooltip />);

    const tooltip = screen.queryByTestId("tooltip");

    expect(tooltip).not.toBeInTheDocument();
  });
});
