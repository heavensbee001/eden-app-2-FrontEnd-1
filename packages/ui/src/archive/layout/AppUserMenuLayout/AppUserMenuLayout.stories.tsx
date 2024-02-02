import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AppUserMenuLayout } from "./AppUserMenuLayout";

export default {
  title: "Archive/Layout/AppUserMenuLayout",
  component: AppUserMenuLayout,
  argTypes: {},
} as ComponentMeta<typeof AppUserMenuLayout>;

const Template: ComponentStory<typeof AppUserMenuLayout> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <AppUserMenuLayout {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {
  recommnededSidebar: true,
};
