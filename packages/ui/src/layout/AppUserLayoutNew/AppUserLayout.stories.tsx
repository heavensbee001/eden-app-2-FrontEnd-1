import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AppUserLayoutNew } from "./AppUserLayoutNew";

export default {
  title: "Layout/AppUserLayoutNew",
  component: AppUserLayoutNew,
  argTypes: {},
} as ComponentMeta<typeof AppUserLayoutNew>;

const Template: ComponentStory<typeof AppUserLayoutNew> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <AppUserLayoutNew {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
