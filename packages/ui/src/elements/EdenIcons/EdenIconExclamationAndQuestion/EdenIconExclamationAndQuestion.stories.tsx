import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EdenIconExclamationAndQuestion } from "./EdenIconExclamationAndQuestion";

export default {
  title: "Elements/EdenIcons/EdenIconExclamationAndQuestion",
  component: EdenIconExclamationAndQuestion,
  argTypes: {},
} as ComponentMeta<typeof EdenIconExclamationAndQuestion>;

const Template: ComponentStory<typeof EdenIconExclamationAndQuestion> = (
  args
) => <EdenIconExclamationAndQuestion {...args} />;

export const Default = Template.bind({});
Default.args = {
  className: "",
};
