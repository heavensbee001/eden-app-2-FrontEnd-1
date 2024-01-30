import { ComponentMeta, ComponentStory } from "@storybook/react";

// import { DynamicSessionProvider } from "@eden/package-context";
import { AdminLayout } from "./AdminLayout";

export default {
  title: "Layout/AdminLayout",
  component: AdminLayout,
  argTypes: {},
} as ComponentMeta<typeof AdminLayout>;

const Template: ComponentStory<typeof AdminLayout> = (args) => (
  <AdminLayout {...args} />
);

export const Default = Template.bind({});
Default.args = {};
