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

function formatLabel(str: string, maxwidth: number) {
  var sections: any[] = [];
  var words = str.split(" ");
  var temp = "";

  words.forEach(function (item, index) {
    if (temp.length > 0) {
      var concat = temp + " " + item;

      if (concat.length > maxwidth) {
        sections.push(temp);
        temp = "";
      } else {
        if (index == words.length - 1) {
          sections.push(concat);
          return;
        } else {
          temp = concat;
          return;
        }
      }
    }

    if (index == words.length - 1) {
      sections.push(item);
      return;
    }

    if (item.length < maxwidth) {
      temp = item;
    } else {
      sections.push(item);
    }
  });

  return sections;
}

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
    tooltip: {
      callbacks: {
        title: (tooltipItems: any[]) => {
          const res = tooltipItems[0].label.split(",").join(" ");

          return res;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: { min: 0, autoSkip: false, display: true, maxRotation: 0 },
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
      const barsLabels = backgroundMatchData.map((item) =>
        formatLabel(item.questionContent, 8)
      );
      const memberData = backgroundMatchData.map((item) => item.userPercentage);
      const averageData = backgroundMatchData.map(
        (item) => item.averagePercentage
      );

      setChartData({
        labels: barsLabels,
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
