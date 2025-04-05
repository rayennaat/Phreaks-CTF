import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, RadarController, PointElement, LineElement, RadialLinearScale, Filler } from 'chart.js';

// Register Chart.js components
Chart.register(RadarController, PointElement, LineElement, RadialLinearScale, Filler);

const UserRadar = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxChallenges, setMaxChallenges] = useState(1);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchSolvedChallenges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/challenges');
        const challenges = response.data;

        const allCategories = [...new Set(challenges.map(challenge => challenge.category))];

        const totalChallengesPerCategory = challenges.reduce((acc, challenge) => {
          acc[challenge.category] = (acc[challenge.category] || 0) + 1;
          return acc;
        }, {});

        const solvedChallenges = challenges.filter(challenge =>
          challenge.solvedByUsers.some(user => user.user_id === userId)
        );

        const solvedChallengesPerCategory = solvedChallenges.reduce((acc, challenge) => {
          acc[challenge.category] = (acc[challenge.category] || 0) + 1;
          return acc;
        }, {});

        const maxChalls = Math.max(...Object.values(totalChallengesPerCategory), 1);

        const formattedData = allCategories.map(category => ({
          category,
          solved: solvedChallengesPerCategory[category] || 0,
          total: totalChallengesPerCategory[category] || 0,  // add this!
        }));

        setData(formattedData);
        setMaxChallenges(maxChalls); // Set maxChallenges to the highest number of challenges in any category
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError('Failed to fetch challenges');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSolvedChallenges();
    }
  }, [userId]);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart instance if it exists
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // Create new chart instance
      chartRef.current.chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: data.map(item => item.category), // Categories as labels
          datasets: [
            {
              label: 'Solved Challenges',
              data: data.map(item => item.solved),
              backgroundColor: 'rgba(79, 209, 197, 0.6)',
              borderColor: '#4FD1C5',
              borderWidth: 2,
              pointBackgroundColor: '#4FD1C5',
            },
            {
              label: 'Total Challenges',
              data: data.map(item => item.total),  // You need to add 'total' to formattedData
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              borderWidth: 1,
              pointBackgroundColor: 'transparent',
            }
          ],
          
        },
        options: {
          scales: {
            r: {
              angleLines: {
                color: '#444', // Color of the angle lines
              },
              grid: {
                color: '#444', // Color of the grid lines
              },
              pointLabels: {
                color: '#fff', // Color of the category labels
                font: {
                  size: 12,
                },
              },
              ticks: {
                color: '#555', // Color of the ticks
                backdropColor: 'transparent', // Hide the background of ticks
                stepSize: 1, // Ensure whole numbers
                max: maxChallenges, // Set max value based on the highest number of challenges in any category
              },
            },
          },
          plugins: {
            legend: {
              display: false, // Hide legend
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [data, maxChallenges]); // Ensure this useEffect depends on maxChallenges

  if (loading) {
    return <div className="text-white">Loading radar chart...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-md w-full h-[400px]">
      <h2 className="mb-4 text-lg font-semibold text-center text-white">🕵️ Solved Categories Radar</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default UserRadar;