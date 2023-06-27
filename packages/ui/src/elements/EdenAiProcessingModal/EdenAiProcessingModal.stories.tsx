import { ComponentMeta, ComponentStory } from "@storybook/react";

import EdenAiProcessingModal from "./EdenAiProcessingModal";

export default {
  title: "Elements/EdenAiProcessingModal",
  component: EdenAiProcessingModal,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} as ComponentMeta<typeof EdenAiProcessingModal>;

const Template: ComponentStory<typeof EdenAiProcessingModal> = (args) => (
  <EdenAiProcessingModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: false,
  title: "EdenAiProcessingModal Title",
  children: "EdenAiProcessingModal Content",
};

export const Open = Template.bind({});
Open.args = {
  open: true,
  title: "EdenAiProcessingModal title",
  children: "EdenAiProcessingModal content",
};
