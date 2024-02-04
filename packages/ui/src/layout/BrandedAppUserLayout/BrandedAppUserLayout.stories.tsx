import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { BrandedAppUserLayout } from "./BrandedAppUserLayout";

export default {
  title: "Layout/BrandedAppUserLayout",
  component: BrandedAppUserLayout,
  argTypes: {},
} as ComponentMeta<typeof BrandedAppUserLayout>;

const Template: ComponentStory<typeof BrandedAppUserLayout> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <BrandedAppUserLayout {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
