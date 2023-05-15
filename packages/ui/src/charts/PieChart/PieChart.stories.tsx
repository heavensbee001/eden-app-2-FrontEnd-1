import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PieChart } from "./PieChart";
export default {
  title: "Charts/PieChart",
  component: PieChart,
  argTypes: {},
} as ComponentMeta<typeof PieChart>;

const chartData = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  data: [12, 19, 3, 5, 2, 3],
  backgroundColor: [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ],
};

const Template: ComponentStory<typeof PieChart> = (args) => (
  <div className="max-w-xl">
    <PieChart {...args} />
    {/* <PieChart chartData={chartData} /> */}
  </div>
);

const exampleData = [
  {
    questionID: "1242",
    questionContent: "Experience",
    userPercentage: 75,
    averagePercentage: 55,
  },
  {
    questionID: "9521",
    questionContent: "Work from Home or Office",
    userPercentage: 35,
    averagePercentage: 45,
  },
  {
    questionID: "2222",
    questionContent: "Skill",
    userPercentage: 85,
    averagePercentage: 75,
  },
  {
    questionID: "1211",
    questionContent: "Industry experience",
    userPercentage: 90,
    averagePercentage: 40,
  },
];

export const Default = Template.bind({});
Default.args = {
  // chartData: chartData,
  memberName: "Melissa",
  backgroundMatchData: exampleData,
};
