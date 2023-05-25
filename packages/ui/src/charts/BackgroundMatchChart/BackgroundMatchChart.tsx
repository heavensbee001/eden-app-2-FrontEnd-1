import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { FC, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      // display: false,
    },
    // title: {
    //   display: true,
    //   text: "Background Match",
    // },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
};

type backgroundMatchDataType = {
  questionID: string;
  questionContent: string;
  userPercentage: number;
  averagePercentage: number;
};

type BackgroundMatchChartProps = {
  memberName: string;
  backgroundMatchData: backgroundMatchDataType[];
};

export const BackgroundMatchChart: FC<BackgroundMatchChartProps> = ({
  memberName,
  backgroundMatchData,
}) => {
  const [chartData, setChartData] = useState<any>(null);

  useMemo(() => {
    if (memberName && backgroundMatchData) {
      const barsLabels = backgroundMatchData.map(
        (item) => item.questionContent
      );
      const memberData = backgroundMatchData.map((item) => item.userPercentage);
      const averageData = backgroundMatchData.map(
        (item) => item.averagePercentage
      );

      setChartData({
        labels: barsLabels?.map((label) => label?.split(" ")),
        datasets: [
          {
            label: memberName,
            data: memberData,
            backgroundColor: "rgba(124, 235, 215)",
          },
          {
            label: "Average Candidate",
            data: averageData,
            backgroundColor: "rgba(211, 232, 228)",
          },
        ],
      });
    }
  }, [memberName, backgroundMatchData]);

  if (!chartData) return <></>;

  return <Bar options={options} data={chartData} />;
};
