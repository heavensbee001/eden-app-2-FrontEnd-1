import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AI_INTERVIEW_SERVICES } from "../InterviewEdenAI";
import { AskEdenPopUp } from "./AskEdenPopUp";

export default {
  title: "Components/AskEdenPopUp",
  component: AskEdenPopUp,
  argTypes: {},
} as ComponentMeta<typeof AskEdenPopUp>;

const Template: ComponentStory<typeof AskEdenPopUp> = (args) => (
  <AskEdenPopUp {...args} />
);

export const Default = Template.bind({});
Default.args = {
  memberID: "123123",
  service: AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION,
};
