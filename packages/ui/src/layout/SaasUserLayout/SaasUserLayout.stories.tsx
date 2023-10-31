import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SessionProvider } from "next-auth/react";

import { SaasUserLayout } from "./SaasUserLayout";

export default {
  title: "Layout/SaasUserLayout",
  component: SaasUserLayout,
  argTypes: {},
} as ComponentMeta<typeof SaasUserLayout>;

const Template: ComponentStory<typeof SaasUserLayout> = (args) => (
  <SessionProvider
    session={{
      expires: "1",
      user: {
        id: "1",
        email: "a",
        name: "Miral",
        image:
          "https://pbs.twimg.com/profile_images/1513838045589430277/4Pxad6DL_400x400.jpg",
      },
    }}
  >
    <SaasUserLayout {...args} />
  </SessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
