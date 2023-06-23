// import { faker } from "@faker-js/faker";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EdenTooltip } from "./EdenTooltip";

export default {
  title: "Components/EdenTooltip",
  component: EdenTooltip,
  argTypes: {},
} as ComponentMeta<typeof EdenTooltip>;

const Template: ComponentStory<typeof EdenTooltip> = (args) => (
  <EdenTooltip {...args}>
    <p>Parent element</p>
  </EdenTooltip>
);

export const Default = Template.bind({});
Default.args = {
  id: "elem1",
  place: "top",
  effect: "solid",
  backgroundColor: "white",
  border: true,
  borderColor: "#e5e7eb",
  padding: "0.5rem",
  innerTsx: (
    <div className="w-60">
      <span className="text-gray-600">Tooltip inner tsx</span>
    </div>
  ),
};
