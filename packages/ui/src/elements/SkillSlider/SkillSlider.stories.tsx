import { ComponentMeta, ComponentStory } from "@storybook/react";

import { SkillSlider } from "./SkillSlider";

export default {
  title: "Elements/SkillSlider",
  component: SkillSlider,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} as ComponentMeta<typeof SkillSlider>;

const Template: ComponentStory<typeof SkillSlider> = (args) => (
  <SkillSlider {...args} />
);

export const Default = Template.bind({});

Default.args = {};
