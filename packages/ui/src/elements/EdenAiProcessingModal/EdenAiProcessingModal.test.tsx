import { render, screen } from "@testing-library/react";

import { EdenAiProcessingModal } from ".";

test("When the modal is open, it displays the content to the user", () => {
  render(
    <EdenAiProcessingModal open={true} title={"Title"}>
      Hello, World!
    </EdenAiProcessingModal>
  );

  expect(screen.getByText("Title")).toBeTruthy();
  expect(screen.getByText("Hello, World!")).toBeTruthy();
});
