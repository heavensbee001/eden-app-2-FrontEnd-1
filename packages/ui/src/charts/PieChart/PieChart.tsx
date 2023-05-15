import {
  BarElement,
  CategoryScale,
  Chart,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type PieChartData = {
  labels: string[];
  data: number[];
  backgroundColor: string[];
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
  },
};

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

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       // position: "top" as const,
//       display: false,
//     },
//     // title: {
//     //   display: true,
//     //   text: "Background Match",
//     // },
//   },
//   scales: {
//     x: {
//       grid: {
//         display: false,
//       },
//     },
//     y: {
//       display: false,
//       grid: {
//         display: false,
//       },
//     },
//   },
// };

type backgroundMatchDataType = {
  questionID: string;
  questionContent: string;
  userPercentage: number;
  averagePercentage: number;
};

type PieChartProps = {
  chartData: PieChartData;
  memberName: string;
  backgroundMatchData: backgroundMatchDataType[];
};

const PieChartF = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef?.current.getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            data: [12, 19, 9],
            backgroundColor: ["red", "blue", "yellow"],
          },
        ],
      },
    });
  }, []);

  return <canvas ref={chartRef} />;
};

export const PieChart: FC<PieChartProps> = ({
  chartData,
  memberName,
  backgroundMatchData,
}) => {
  // const [chartData, setChartData] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  // useMemo(() => {
  //   if (memberName && backgroundMatchData) {
  //     const barsLabels = backgroundMatchData.map(
  //       (item) => item.questionContent
  //     );
  //     const memberData = backgroundMatchData.map((item) => item.userPercentage);
  //     const averageData = backgroundMatchData.map(
  //       (item) => item.averagePercentage
  //     );

  //     setChartData({
  //       labels: barsLabels,
  //       datasets: [
  //         {
  //           label: memberName,
  //           data: memberData,
  //           backgroundColor: "rgba(23, 48, 232)",
  //         },
  //         {
  //           label: "Average Candidate",
  //           data: averageData,
  //           backgroundColor: "rgba(100, 151, 227)",
  //         },
  //       ],
  //     });
  //   }
  // }, [memberName, backgroundMatchData]);

  useMemo(() => {
    if (chartData) {
      setData({
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data,
            backgroundColor: chartData.backgroundColor,
          },
        ],
      });
    }
  }, [chartData]);

  // if (!chartData) return <></>;
  // if (!data) return <></>;
  if (!data)
    return (
      <>
        <p>hey</p>
        {/* <Pie data={chartData} options={options} /> */}
      </>
    );

  // return <Bar options={options} data={chartData} />;
  return <Pie data={data} options={options} />;
};
