import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Python", "C", "Scilab", "OpenFOAM"],
  datasets: [
    {
      label: "Workshops Conducted",
      data: [12, 8, 6, 4],
      backgroundColor: "rgba(99,102,241,0.6)"
    }
  ]
};

function StatisticsChart() {
  return (
    <div style={{ width: "600px", margin: "40px auto" }}>
      <h2>Workshop Statistics</h2>
      <Bar data={data} />
    </div>
  );
}

export default StatisticsChart;