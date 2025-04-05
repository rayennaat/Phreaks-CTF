import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';

const DonutChart = ({ userId }) => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/challenges');
        const challenges = response.data;

        // Count total tasks
        const totalTasks = challenges.length;

        // Count solved tasks by userId
        const solvedTasks = challenges.filter(challenge =>
          challenge.solvedByUsers.some(user => user.user_id === userId)
        ).length;

        // Prepare data for the pie chart
        const formattedData = [
          {
            id: 'Solved',
            label: 'Solved',
            value: solvedTasks,
            color: 'hsl(120, 70%, 50%)'
          },
          {
            id: 'Unsolved',
            label: 'Unsolved',
            value: totalTasks - solvedTasks,
            color: 'hsl(0, 70%, 50%)'
          }
        ];

        setTaskData(formattedData);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTaskData();
    }
  }, [userId]);

  if (loading) return <div className="text-white">Loading chart...</div>;

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-md w-full h-[500px]">
      <h2 className="mb-4 text-lg font-semibold text-center text-white">✅ Solved Tasks Overview</h2>
      <div style={{ height: '400px' }}>
      {taskData.length > 0 ? (
        <ResponsivePie
          data={taskData}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          innerRadius={0.6}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={['#4CAF50', '#F44336']} // Green for solved, red for unsolved
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          enableArcLinkLabels={false}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#fff"
          arcLabel={(datum) => `${Math.round((datum.value / taskData.reduce((sum, item) => sum + item.value, 0)) * 100)}%`}
          tooltip={({ datum }) => (
            <div
              style={{
                backgroundColor: '#000',
                padding: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#fff',
              }}
            >
              <strong>{datum.label}</strong>: {datum.value} tasks
            </div>
          )}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 80,
              translateY: 0,
              itemsSpacing: 5,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#fff',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#fff',
                  },
                },
              ],
            },
          ]}
        />
      ) : (
        <p className="text-center text-white">No task data found.</p>
      )}
      </div>
    </div>
  );
};

export default DonutChart;