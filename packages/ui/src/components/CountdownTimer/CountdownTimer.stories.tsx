import { ComponentMeta, ComponentStory } from "@storybook/react";

import { CountdownTimer } from "./CountdownTimer";

export default {
  title: "Components/CountdownTimer",
  component: CountdownTimer,
  argTypes: {},
} as ComponentMeta<typeof CountdownTimer>;

const Template: ComponentStory<typeof CountdownTimer> = (args) => (
  <CountdownTimer {...args} />
);

export const Default = Template.bind({});
Default.args = {};
