import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LoginButton } from "./LoginButton";

export default {
  title: "Components/LoginButton",
  component: LoginButton,
  argTypes: {},
} as ComponentMeta<typeof LoginButton>;

const Template: ComponentStory<typeof LoginButton> = () => {
  return (
    <DynamicSessionProvider fetchingToken={false}>
      <LoginButton />
    </DynamicSessionProvider>
  );
};

const NotLoggedIn: ComponentStory<typeof LoginButton> = () => {
  return (
    <DynamicSessionProvider fetchingToken={false}>
      <LoginButton />
    </DynamicSessionProvider>
  );
};

export const Default = Template.bind({});
export const NotLogged = NotLoggedIn.bind({});
