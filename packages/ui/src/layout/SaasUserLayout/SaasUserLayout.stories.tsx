import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { SaasUserLayout } from "./SaasUserLayout";

export default {
  title: "Layout/SaasUserLayout",
  component: SaasUserLayout,
  argTypes: {},
} as ComponentMeta<typeof SaasUserLayout>;

const Template: ComponentStory<typeof SaasUserLayout> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <SaasUserLayout {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
