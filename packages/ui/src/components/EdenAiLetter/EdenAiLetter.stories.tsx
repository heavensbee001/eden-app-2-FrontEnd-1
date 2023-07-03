import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EdenAiLetter } from "./EdenAiLetter";

export default {
  title: "Components/EdenAiLetter",
  component: EdenAiLetter,
  argTypes: {},
} as ComponentMeta<typeof EdenAiLetter>;

const Template: ComponentStory<typeof EdenAiLetter> = (args) => (
  <EdenAiLetter {...args} />
);

export const Default = Template.bind({});
Default.args = {};
