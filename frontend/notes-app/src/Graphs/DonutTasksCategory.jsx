import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FFCD56', '#C9CBCF', '#36A2EB', '#9966FF'
];

const DonutTasksCategory = ({ userId }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolvedCategories = async () => {
      try {
        const response = await axios.get('https://phreaks-ctf.onrender.com/api/challenges');
        const challenges = response.data;

        // Get all categories from challenges
        const allCategories = [...new Set(challenges.map(c => c.category))];

        // Filter tasks solved by the user
        const solvedChallenges = challenges.filter(challenge =>
          challenge.solvedByUsers.some(user => user.user_id === userId)
        );

        // Count solved tasks per category
        const solvedCounts = solvedChallenges.reduce((acc, challenge) => {
          acc[challenge.category] = (acc[challenge.category] || 0) + 1;
          return acc;
        }, {});

        // Calculate total solved challenges
        const totalSolved = Object.values(solvedCounts).reduce((sum, count) => sum + count, 0);

        // Prepare data with ALL categories (even if solved count is 0)
        const formattedData = allCategories.map((category, index) => ({
          id: category,
          label: category,
          value: solvedCounts[category] || 0,
          color: COLORS[index % COLORS.length],
          percentage: totalSolved > 0 ? ((solvedCounts[category] || 0) / totalSolved) * 100 : 0
        }));

        setCategoryData(formattedData);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSolvedCategories();
    }
  }, [userId]);

  if (loading) return <div className="text-white">Loading chart...</div>;

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-md w-full h-[500px]">
      <h2 className="mb-4 text-lg font-semibold text-center text-white">📊 Tasks by Category</h2>
      <div style={{ height: '400px' }}>
        <ResponsivePie
          data={categoryData}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          innerRadius={0.6}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          enableArcLinkLabels={false}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#fff"
          arcLabel={(datum) => `${Math.round(datum.data.percentage)}%`}
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
              <strong>{datum.label}</strong>: {datum.value} tasks ({Math.round(datum.data.percentage)}%)
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

export default DonutTasksCategory;