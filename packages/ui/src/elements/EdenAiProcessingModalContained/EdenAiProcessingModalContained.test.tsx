import { render, screen } from "@testing-library/react";

import { EdenAiProcessingModalContained } from ".";

test("When the modal is open, it displays the content to the user", () => {
  render(
    <EdenAiProcessingModalContained open={true} title={"Title"}>
      Hello, World!
    </EdenAiProcessingModalContained>
  );

  expect(screen.getByText("Title")).toBeTruthy();
  expect(screen.getByText("Hello, World!")).toBeTruthy();
});
