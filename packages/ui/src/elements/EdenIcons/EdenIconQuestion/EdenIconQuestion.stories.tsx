import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EdenIconQuestion } from "./EdenIconQuestion";

export default {
  title: "Elements/EdenIcons/EdenIconQuestion",
  component: EdenIconQuestion,
  argTypes: {},
} as ComponentMeta<typeof EdenIconQuestion>;

const Template: ComponentStory<typeof EdenIconQuestion> = (args) => (
  <EdenIconQuestion {...args} />
);

export const Default = Template.bind({});
Default.args = {
  className: "",
};
