export const teamsData = {
    labels: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"], // Time intervals
    datasets: [
      {
        label: "Team A",
        data: [30, 50, 70, 45, 85, 60, 95, 80], // Example fixed scores
        borderColor: "rgb(255, 99, 132)", // Red
      },
      {
        label: "Team B",
        data: [20, 40, 65, 35, 75, 55, 85, 70], // Example fixed scores
        borderColor: "rgb(54, 162, 235)", // Blue
      },
      {
        label: "Team C",
        data: [25, 45, 55, 50, 80, 65, 90, 75], // Example fixed scores
        borderColor: "rgb(255, 205, 86)", // Yellow
      },
      {
        label: "Team D",
        data: [15, 35, 50, 40, 70, 55, 80, 65], // Example fixed scores
        borderColor: "rgb(75, 192, 192)", // Green
      },
      {
        label: "Team E",
        data: [10, 30, 40, 35, 60, 45, 70, 100], // Example fixed scores
        borderColor: "rgb(153, 102, 255)", // Purple
      },
    ],
  };
  
export const barChartData = {
    labels: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"], // Time intervals
    datasets: [
      {
        label: "Team A",
        data: [30, 50, 70, 45, 85, 60, 95, 80], // Scores
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Red with transparency
        borderColor: "rgb(255, 99, 132)", // Red border
        borderWidth: 1,
      },
      {
        label: "Team B",
        data: [20, 40, 65, 35, 75, 55, 85, 70], // Scores
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Blue with transparency
        borderColor: "rgb(54, 162, 235)", // Blue border
        borderWidth: 1,
      },
      {
        label: "Team C",
        data: [25, 45, 55, 50, 80, 65, 90, 75], // Scores
        backgroundColor: "rgba(255, 205, 86, 0.5)", // Yellow with transparency
        borderColor: "rgb(255, 205, 86)", // Yellow border
        borderWidth: 1,
      },
      {
        label: "Team D",
        data: [15, 35, 50, 40, 70, 55, 80, 65], // Scores
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Green with transparency
        borderColor: "rgb(75, 192, 192)", // Green border
        borderWidth: 1,
      },
      {
        label: "Team E",
        data: [10, 30, 40, 35, 60, 45, 70, 100], // Scores
        backgroundColor: "rgba(153, 102, 255, 0.5)", // Purple with transparency
        borderColor: "rgb(153, 102, 255)", // Purple border
        borderWidth: 1,
      },
    ],
  };

  export const bumpChartData = [
  {
    id: "Team A",
    data: [
      { x: "13:00", y: 4 },
      { x: "14:00", y: 3 },
      { x: "15:00", y: 2 },
      { x: "16:00", y: 4 },
      { x: "17:00", y: 1 },
      { x: "18:00", y: 2 },
      { x: "19:00", y: 1 },
      { x: "20:00", y: 1 },
    ],
  },
  {
    id: "Team B",
    data: [
      { x: "13:00", y: 3 },
      { x: "14:00", y: 2 },
      { x: "15:00", y: 1 },
      { x: "16:00", y: 3 },
      { x: "17:00", y: 2 },
      { x: "18:00", y: 3 },
      { x: "19:00", y: 2 },
      { x: "20:00", y: 2 },
    ],
  },
  {
    id: "Team C",
    data: [
      { x: "13:00", y: 5 },
      { x: "14:00", y: 5 },
      { x: "15:00", y: 4 },
      { x: "16:00", y: 2 },
      { x: "17:00", y: 3 },
      { x: "18:00", y: 1 },
      { x: "19:00", y: 3 },
      { x: "20:00", y: 3 },
    ],
  },
  {
    id: "Team D",
    data: [
      { x: "13:00", y: 2 },
      { x: "14:00", y: 4 },
      { x: "15:00", y: 3 },
      { x: "16:00", y: 5 },
      { x: "17:00", y: 4 },
      { x: "18:00", y: 4 },
      { x: "19:00", y: 4 },
      { x: "20:00", y: 4 },
    ],
  },
  {
    id: "Team E",
    data: [
      { x: "13:00", y: 1 },
      { x: "14:00", y: 1 },
      { x: "15:00", y: 5 },
      { x: "16:00", y: 1 },
      { x: "17:00", y: 5 },
      { x: "18:00", y: 5 },
      { x: "19:00", y: 5 },
      { x: "20:00", y: 5 },
    ],
  },
];

export const pieChartData = {
  labels: ["Not Solved", "Solved"],
  datasets: [
    {
      label: "Tasks",
      data: [80, 20],
      backgroundColor: [
        "rgba(75, 192, 192, 0.5)", // Color for "Not Solved"
        "rgba(255, 205, 86, 0.5)", // Color for "Solved"
      ],
      hoverOffset: 4,
    },
  ],
};

  