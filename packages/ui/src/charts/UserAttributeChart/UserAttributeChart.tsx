import {
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { startCase } from "lodash";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type AttributesType = {
  experience: number;
  availability: number;
  skillMatch: number;
  accountability: number;
};

export interface IPosition {
  positionInfo: {
    discordName: string;
    attributes: AttributesType;
  };
}

export interface IUserAttributeChartProps {
  positions: IPosition[];
}

const colors = ["#98FF87B0", "#A2EDFDB0", "#FF9BE9B0", "#E5ADFFB0"];

const options: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    r: {
      grid: {
        circular: true,
      },
      ticks: {
        display: false,
      },
      min: 0,
      beginAtZero: true,
      pointLabels: {
        padding: 14,
        color: "#000",
        font: {
          size: 14,
          weight: "700",
        },
      },
    },
  },
  elements: {
    // point: {
    //   radius: 0,
    // },
  },
};

export const UserAttributeChart = ({ positions }: IUserAttributeChartProps) => {
  const labels = Object.keys(positions[0].positionInfo.attributes).map((item) =>
    startCase(item)
  );
  const datasets = positions.map(({ positionInfo }, i) => {
    return {
      label: positionInfo.discordName,
      data: Object.keys(positionInfo.attributes).map(
        (key) => positionInfo.attributes[key as keyof AttributesType]
      ),
      fill: true,
      borderWidth: 0,
      backgroundColor: colors[i],
    };
  });

  return (
    <Radar
      options={options}
      data={{
        labels,
        datasets,
      }}
    />
  );
};
