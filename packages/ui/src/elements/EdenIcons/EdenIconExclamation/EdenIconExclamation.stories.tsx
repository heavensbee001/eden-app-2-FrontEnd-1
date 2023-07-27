import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EdenIconExclamation } from "./EdenIconExclamation";

export default {
  title: "Elements/EdenIcons/EdenIconExclamation",
  component: EdenIconExclamation,
  argTypes: {},
} as ComponentMeta<typeof EdenIconExclamation>;

const Template: ComponentStory<typeof EdenIconExclamation> = (args) => (
  <EdenIconExclamation {...args} />
);

export const Default = Template.bind({});
Default.args = {
  className: "",
};
