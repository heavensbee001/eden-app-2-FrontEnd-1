import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ProgressCircle } from "./ProgressCircle";

export default {
  title: "Components/ProgressCircle",
  component: ProgressCircle,
  argTypes: {},
} as ComponentMeta<typeof ProgressCircle>;

const Template: ComponentStory<typeof ProgressCircle> = (args) => (
  <ProgressCircle {...args} />
);

export const Default = Template.bind({});
Default.args = {};
