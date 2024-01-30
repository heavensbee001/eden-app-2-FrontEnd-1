import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AppUserSubmenuLayout } from "./AppUserSubmenuLayout";

export default {
  title: "Layout/AppUserSubmenuLayout",
  component: AppUserSubmenuLayout,
  argTypes: {},
} as ComponentMeta<typeof AppUserSubmenuLayout>;

const Template: ComponentStory<typeof AppUserSubmenuLayout> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <AppUserSubmenuLayout {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
