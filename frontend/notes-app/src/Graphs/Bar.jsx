import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { barChartData } from "./LineData"; // Correctly point to your data file

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = () => {
    const options ={
        responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
    };
    return <Bar options={options} data={barChartData}/>;
};