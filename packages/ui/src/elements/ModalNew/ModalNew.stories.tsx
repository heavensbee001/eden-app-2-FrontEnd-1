import { ComponentMeta, ComponentStory } from "@storybook/react";

import ModalNew from "./ModalNew";

export default {
  title: "Elements/ModalNew",
  component: ModalNew,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} as ComponentMeta<typeof ModalNew>;

const Template: ComponentStory<typeof ModalNew> = (args) => (
  <ModalNew {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: false,
  title: "Modal Title",
  children: "Modal Content",
  closeOnEsc: true,
};

export const Open = Template.bind({});
Open.args = {
  open: true,
  title: "Modal title",
  children: "Modal content",
};
