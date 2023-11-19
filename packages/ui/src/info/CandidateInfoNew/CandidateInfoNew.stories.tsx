import { getMember } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { CandidateInfoNew } from "./CandidateInfoNew";

export default {
  title: "Info/CandidateInfoNew",
  component: CandidateInfoNew,
  argTypes: {},
} as ComponentMeta<typeof CandidateInfoNew>;

const Template: ComponentStory<typeof CandidateInfoNew> = (args) => {
  return <CandidateInfoNew {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  member: getMember(),
  percentage: 83,
};
