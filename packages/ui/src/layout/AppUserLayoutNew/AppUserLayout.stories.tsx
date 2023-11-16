import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SessionProvider } from "next-auth/react";

import { AppUserLayoutNew } from "./AppUserLayoutNew";

export default {
  title: "Layout/AppUserLayoutNew",
  component: AppUserLayoutNew,
  argTypes: {},
} as ComponentMeta<typeof AppUserLayoutNew>;

const Template: ComponentStory<typeof AppUserLayoutNew> = (args) => (
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
    <AppUserLayoutNew {...args} />
  </SessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
