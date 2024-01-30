import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AppUserLayout } from "./AppUserLayout";

export default {
  title: "Layout/AppUserLayout",
  component: AppUserLayout,
  argTypes: {},
} as ComponentMeta<typeof AppUserLayout>;

const Template: ComponentStory<typeof AppUserLayout> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <AppUserLayout {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
