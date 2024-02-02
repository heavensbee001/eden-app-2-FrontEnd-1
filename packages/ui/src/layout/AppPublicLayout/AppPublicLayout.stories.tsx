import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AppPublicLayout } from "./AppPublicLayout";

export default {
  title: "Layout/AppPublicLayout",
  component: AppPublicLayout,
  argTypes: {},
} as ComponentMeta<typeof AppPublicLayout>;

const Template: ComponentStory<typeof AppPublicLayout> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <AppPublicLayout {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
