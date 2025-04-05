import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveLine } from '@nivo/line';

const AreaChartComponent = ({ teamId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/challenges');
        const challenges = response.data;

        // Filter tasks solved by the team
        const solvedTasks = challenges.flatMap(challenge =>
          challenge.solvedByTeams
            .filter(team => team.team_id === teamId)
            .map(team => ({ time: team.time }))
        );

        // Process the data to count tasks solved every 30 minutes
        const processedData = processData(solvedTasks);
        setData(processedData);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchChallenges();
    }
  }, [teamId]);

  const processData = (solvedTasks) => {
    const timeIntervals = {};
    solvedTasks.forEach(task => {
      const time = new Date(task.time);
      const roundedTime = new Date(time);
      roundedTime.setMinutes(Math.floor(time.getMinutes() / 30) * 30);
      roundedTime.setSeconds(0);
      roundedTime.setMilliseconds(0);

      const key = roundedTime.toISOString();
      if (!timeIntervals[key]) {
        timeIntervals[key] = 0;
      }
      timeIntervals[key]++;
    });

    // Convert the processed data into the format required by Nivo
    const formattedData = Object.keys(timeIntervals).map(key => ({
      x: key,
      y: timeIntervals[key],
    }));

    // Sort data by time
    formattedData.sort((a, b) => new Date(a.x) - new Date(b.x));

    return [
      {
        id: 'Tasks Solved',
        data: formattedData,
      },
    ];
  };

  if (loading) return <div className="text-white">Loading chart...</div>;

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-md w-full h-[400px]">
      <h2 className="mb-4 text-lg font-semibold text-center text-white">📈 Tasks Solved Over Time</h2>
      <div style={{ height: '350px' }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{
            type: 'time',
            format: '%Y-%m-%dT%H:%M:%S.%LZ',
            precision: 'minute',
          }}
          xFormat="time:%Y-%m-%d %H:%M"
          yScale={{
            type: 'linear',
            min: 0,
            max: 'auto',
          }}
          curve="monotoneX" // Smooth curve
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: '%H:%M',
            tickValues: 'every 30 minutes',
            legend: 'Time',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            legend: 'Tasks Solved',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          enableGridX={false}
          enableGridY={true}
          colors={{ scheme: 'set1' }} // Use a color scheme
          lineWidth={2}
          pointSize={6}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableArea={true} // Enable area under the line
          areaOpacity={0.3} // Transparency for the area
          enableSlices="x" // Show tooltips on hover
          useMesh={true} // Enable mesh for better hover interactions
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          tooltip={({ point }) => (
            <div
              style={{
                backgroundColor: '#000',
                padding: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#fff',
              }}
            >
              <strong>{point.data.xFormatted}</strong>: {point.data.y} tasks solved
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default AreaChartComponent;