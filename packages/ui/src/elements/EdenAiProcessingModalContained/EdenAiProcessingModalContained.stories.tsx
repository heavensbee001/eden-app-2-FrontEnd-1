import { ComponentMeta, ComponentStory } from "@storybook/react";

import EdenAiProcessingModalContained from "./EdenAiProcessingModalContained";

export default {
  title: "Elements/EdenAiProcessingModalContained",
  component: EdenAiProcessingModalContained,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} as ComponentMeta<typeof EdenAiProcessingModalContained>;

const Template: ComponentStory<typeof EdenAiProcessingModalContained> = (
  args
) => <EdenAiProcessingModalContained {...args} />;

export const Default = Template.bind({});
Default.args = {
  open: false,
  title: "EdenAiProcessingModalContained Title",
  children: "EdenAiProcessingModalContained Content",
};

export const Open = Template.bind({});
Open.args = {
  open: true,
  title: "EdenAiProcessingModalContained title",
  children: "EdenAiProcessingModalContained content",
};
