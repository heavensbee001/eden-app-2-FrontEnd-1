import { render } from "../../../utils/jest-apollo";
import { SendMessageToUserModal } from ".";

describe("SendMessageToUserModal", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <SendMessageToUserModal
        openModal
        sender="Milo"
        senderId={3787}
        receiver="MelonMusk"
        onSubmit={function (message: string): void {
          console.log(message);

          throw new Error("Function not implemented.");
        }}
      />
    );

    expect(container).toBeInTheDocument();
  });
});
