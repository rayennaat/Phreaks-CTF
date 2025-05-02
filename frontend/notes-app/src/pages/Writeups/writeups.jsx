import React, { useEffect, useState } from 'react';
import UserBar from '../../components/UserBar/UserBar';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Writeups = () => {
  const [writeups, setWriteups] = useState([]);
  const [mostLikedWriteups, setMostLikedWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWriteups = async () => {
      try {
        const response = await fetch('https://phreaks-ctf.onrender.com/api/writeups');
        if (!response.ok) {
          throw new Error('Failed to fetch writeups');
        }
        const data = await response.json();

        setWriteups(data);

        // Count the number of writeups per category
        const categoryCounts = data.reduce((acc, writeup) => {
          acc[writeup.category] = (acc[writeup.category] || 0) + 1;
          return acc;
        }, {});

        // Format data for Recharts
        const formattedData = Object.entries(categoryCounts).map(([category, count]) => ({
          name: category,
          value: count
        }));

        setCategoryData(formattedData);

        // Get the top 5 most liked writeups
        const sortedWriteups = [...data]
          .sort((a, b) => b.likes.length - a.likes.length)
          .slice(0, 5);

        setMostLikedWriteups(sortedWriteups);
      } catch (error) {
        console.error('Error fetching writeups:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWriteups();
  }, []);
  
  const filteredWriteups = writeups.filter(writeup =>
    writeup.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-lg text-white">Loading writeups...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-10 bg-gray-900">
      <UserBar />
      <br /><br />

      <div className="flex flex-col gap-4 pt-24 mx-auto pl-14 pr-14 md:flex-row">
        {/* Left Section (Search Bar + Writeups Table) */}
        <div className="flex flex-col flex-1 gap-4">
          {/* Search Bar */}
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <input
              type="text"
              placeholder="Search writeups..."
              className="w-full p-2 text-white placeholder-gray-400 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Writeups Table (Cards) */}
          <div className="space-y-1">
            {filteredWriteups.map((writeup) => (
              <div
                key={writeup._id}
                className="flex items-center justify-between p-4 transition-colors duration-300 bg-gray-800 rounded-lg shadow hover:bg-gray-700"
              >
                {/* Left Section - Category Badge */}
                <div className="flex items-center justify-center w-1/5 h-16 text-sm font-bold text-white bg-gray-700 rounded-md">
                  {writeup.category}
                </div>

                {/* Middle Section - Details */}
                <div className="flex flex-col flex-1 px-4">
                  <h2 className="text-lg font-semibold text-white">{writeup.title}</h2>
                  <p className="text-sm text-gray-300">{writeup.summary}</p>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>✍️ {writeup.author}</span>
                      <span>📅 {new Date(writeup.date).toLocaleDateString()}</span>
                    </div>
                    <a
                      href={`/writeups/${writeup._id}`}
                      className="text-sm text-white hover:underline"
                    >
                      Read More →
                    </a>
                  </div>
                </div>

                {/* Right Section - Likes & Comments */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center text-sm text-gray-300">
                    ❤️ <span className="ml-1">{writeup.likes.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section (Most Liked + Top Writers) */}
        <div className="w-[500px] flex flex-col gap-4">
          <div className="h-[350px] flex flex-row gap-4">
            
            {/* Most Liked Writeups */}
            <div className="w-1/2 p-4 text-white bg-gray-800 rounded-lg shadow">
              <h3 className="flex items-center mb-4 text-lg font-normal">
                🔥 Most Liked
              </h3>
              <ul className="space-y-2">
                {mostLikedWriteups.map((writeup) => (
                  <li key={writeup._id} className="flex items-center justify-between p-3 transition bg-gray-700 rounded-md hover:bg-gray-600">
                    <a href={`/writeups/${writeup._id}`} className="font-medium text-white hover:underline">
                      {writeup.title}
                    </a>
                    <span className="flex items-center gap-1 text-gray-300">
                      ❤️ {writeup.likes.length}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Writers (Based on Writeup Count) */}
            <div className="w-1/2 p-4 text-white bg-gray-800 rounded-lg shadow">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                🏆 Top Writers
              </h3>
              <ul className="space-y-2">
                {Object.entries(
                  writeups.reduce((acc, { author }) => {
                    acc[author] = (acc[author] || 0) + 1; // Count writeups per author
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1]) // Sort by writeup count
                  .slice(0, 5) // Get top 5 writers
                  .map(([author, count], index) => (
                    <li key={index} className="flex flex-row items-center justify-between gap-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                      <div className="flex items-center gap-2">
                        🏆 <span className="font-medium text-white">{author}</span>
                      </div>
                      <span className="ml-auto text-xs text-gray-300">- {count} Writeups</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          
          {/* Writeups Per Category Pie Chart */}
          <div className="flex-col h-[400px] bg-gray-800 p-4 rounded-lg shadow flex items-center justify-center">
            <h2 className="text-lg font-semibold text-white">📊 Writeups by Category</h2>
            
            {categoryData.length > 0 ? (
              <>
                <PieChart width={300} height={300}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    stroke="transparent"
                    strokeWidth={2}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="14px"
                          fontWeight="bold"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} // Updated to standard chart colors
                      />
                    ))}
                  </Pie>
                </PieChart>

                {/* Custom Legend Below */}
                <div className="flex flex-row mt-4 space-x-2">
                  {categoryData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4],
                        }}
                      ></div>
                      <span className="text-sm text-white">
                        {entry.name} - {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-white">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Writeups;