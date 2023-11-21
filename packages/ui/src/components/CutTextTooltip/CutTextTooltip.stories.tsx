import { ComponentMeta, Story } from "@storybook/react";
import CutTextTooltip, { CutTextTooltipProps } from "./CutTextTooltip";

export default {
  title: "Components/CutTextTooltip",
  component: CutTextTooltip,
  argTypes: {
    text: {
      control: "text",
    },
    className: {
      control: "text",
    },
  },
} as ComponentMeta<typeof CutTextTooltip>;

const Template: Story<CutTextTooltipProps> = (args) => (
  <CutTextTooltip {...args} />
);

export const Default = Template.bind({});
Default.args = {
  text: "This is a long text that will be truncated",
  className: "your-custom-class",
};
