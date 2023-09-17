import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LeftNav } from "./LeftNav";

export default {
  title: "Components/LeftToggleNav",
  component: LeftNav,
  argTypes: {},
} as ComponentMeta<typeof LeftNav>;

const Template: ComponentStory<typeof LeftNav> = (args) => (
  <LeftNav {...args} />
);

export const Default = Template.bind({});
Default.args = {};
