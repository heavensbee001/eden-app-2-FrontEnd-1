import { ComponentMeta, ComponentStory } from "@storybook/react";

import { SelectList } from "./SelectList";

export default {
  title: "Elements/SelectList",
  component: SelectList,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} as ComponentMeta<typeof SelectList>;

const Template: ComponentStory<typeof SelectList> = (args) => (
  <SelectList {...args} />
);

export const Default = Template.bind({});

Default.args = {
  caption: "Select item",
  items: [
    "Wade Cooper",
    "Arlene Mccoy",
    "Devon Webb",
    "Tom Cook",
    "Tanya Fox",
    "Hellen Schmidt",
  ],
};
