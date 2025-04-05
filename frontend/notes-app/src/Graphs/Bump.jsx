import React from "react";
import { ResponsiveBump } from "@nivo/bump";
import { bumpChartData } from "./LineData"; // Point to your data file

export const BumpChart = () => {
  const options = {
    margin: { top: 40, right: 100, bottom: 40, left: 60 },
    colors: { scheme: "category10" },
    lineWidth: 3,
    activeLineWidth: 6,
    inactiveLineWidth: 2,
    inactiveOpacity: 0.15,
    pointSize: 10,
    activePointSize: 16,
    inactivePointSize: 0,
    pointColor: { theme: "background" },
    pointBorderWidth: 3,
    pointBorderColor: { from: "serie.color" },
    axisTop: null,
    axisRight: null,
    axisBottom: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
    },
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
    },
    animate: true,
    motionConfig: "wobbly",
  };

  return (
    <div style={{ height: 500 }}>
      <ResponsiveBump data={bumpChartData} {...options} />
    </div>
  );
};
