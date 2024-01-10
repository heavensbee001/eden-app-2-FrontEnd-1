import { getMember } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { CandidateInfoTestSearchAlgo } from "./CandidateInfoTestSearchAlgo";

export default {
  title: "Info/CandidateInfoTestSearchAlgo",
  component: CandidateInfoTestSearchAlgo,
  argTypes: {},
} as ComponentMeta<typeof CandidateInfoTestSearchAlgo>;

const Template: ComponentStory<typeof CandidateInfoTestSearchAlgo> = (args) => {
  return <CandidateInfoTestSearchAlgo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  member: getMember(),
  percentage: 83,
};
