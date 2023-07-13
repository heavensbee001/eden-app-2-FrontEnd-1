import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LeftToggleNav } from "./LeftToggleNav";

export default {
  title: "Components/LeftToggleNav",
  component: LeftToggleNav,
  argTypes: {},
} as ComponentMeta<typeof LeftToggleNav>;

const Template: ComponentStory<typeof LeftToggleNav> = (args) => (
  <LeftToggleNav {...args} />
);

export const Default = Template.bind({});
Default.args = {};
