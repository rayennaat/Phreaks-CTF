import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';

const DonutTasksSolved = ({ teamId }) => {
  const [solvedTasks, setSolvedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://phreaks-ctf.onrender.com/api/challenges');
        const challenges = response.data;

        // Count total tasks
        const total = challenges.length;

        // Count tasks solved by the team
        const solved = challenges.filter(challenge =>
          challenge.solvedByTeams.some(team => team.team_id === teamId)
        ).length;

        setSolvedTasks(solved);
        setTotalTasks(total);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTasks();
    }
  }, [teamId]);

  if (loading) return <div className="text-white">Loading chart...</div>;

  const data = [
    {
      id: 'Solved',
      label: 'Solved',
      value: solvedTasks,
      color: '#00FF00', // Green for solved tasks
    },
    {
      id: 'Remaining',
      label: 'Remaining',
      value: totalTasks - solvedTasks,
      color: '#ff0000', // Red for remaining tasks
    },
  ];

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-md w-full h-[500px] border border-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-center text-white">✅ Tasks Solved</h2>
      <div style={{ height: '400px' }}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          innerRadius={0.6} // Donut hole size (60%)
          padAngle={0.7} // Space between slices
          cornerRadius={3} // Rounded corners
          activeOuterRadiusOffset={8} // Hover effect (8px offset)
          colors={{ datum: 'data.color' }} // Use custom colors
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }} // Transparent borders
          enableArcLinkLabels={false} // Disable arc link labels
          arcLabelsSkipAngle={10} // Skip labels for small slices
          arcLabelsTextColor="#fff" // White text for labels
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
      </div>
    </div>
  );
};

export default DonutTasksSolved;