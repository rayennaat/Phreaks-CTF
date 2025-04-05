import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import DOMPurify from "dompurify";
 
const WriteupDetails = () => {
  const { id } = useParams(); // Get the writeup ID from the URL
  const [writeup, setWriteup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [userId, setUserId] = useState(null); // ✅ Add userId state

  // Fetch writeup details on mount
  useEffect(() => {
    const fetchWriteup = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch the writeup
        const writeupResponse = await axios.get(`http://localhost:5000/api/writeups/${id}`, { headers });
        setWriteup(writeupResponse.data);
        setLikesCount(writeupResponse.data.likes ? writeupResponse.data.likes.length : 0);

        // Fetch the current user's ID (if token exists)
        
        const userResponse = await axios.get('http://localhost:5000/get-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            _: Date.now(), // Cache-busting parameter
          },
        });
        
        if (userResponse.data && userResponse.data.user) {
          setUserId(userResponse.data.user.id); // ✅ Set userId state
          console.log("✅ User ID:", userResponse.data.user.id); // Debugging
        } else {
          setError('User data not found.');
        }
          

        // Check if the current user has liked the writeup
        if (userId && writeupResponse.data.likes && writeupResponse.data.likes.includes(userId)) {
          setLiked(true); // ✅ Set liked to true if the user's ID is in the likes array
        } else {
          setLiked(false); // ✅ Set liked to false if the user's ID is not in the likes array
        }
      } catch (error) {
        toast.error("Failed to load writeup.");
      } finally {
        setLoading(false);
      }
    };

    fetchWriteup();
  }, [id, userId]); // ✅ Add userId to dependency array
  

  // Handle like toggle
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You need to log in to like this writeup.");
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5000/api/writeups/${id}/like`,
        {}, // No body needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      toast.error("Error liking writeup.");
    }
  }; 
  
  const processDescription = (html) => {
  if (!html) return '';

  // Create a DOMParser instance to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Find all images and fix their src if necessary
  const images = doc.querySelectorAll('img');
  images.forEach((img) => {
    const src = img.getAttribute('src');
    if (src && src.startsWith('/uploads')) {
      img.setAttribute('src', `http://localhost:5000${src}`);
    }
  });

  return doc.body.innerHTML;
};


  

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading...
      </div>
    );
  if (!writeup)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Writeup not found.
      </div>
    );

  return (
    <div className="min-h-screen py-6 pl-10 pr-10 text-white bg-gray-900">
      <Toaster position="top-center" />
      <div className="max-w-6xl pt-10 mx-auto">
        {/* Title & Category */}
        <h1 className="mb-5 text-5xl font-bold text-pink-400">{writeup.title}</h1>
        <span className="px-4 py-1 text-sm bg-gray-700 rounded-md">
          {writeup.category}
        </span>

        {/* Author & Date */}
        <div className="mt-3 text-lg text-gray-400">
          ✍️ {writeup.author} &nbsp;|&nbsp; 📅{" "}
          {new Date(writeup.date).toLocaleDateString()}
        </div>

        {/* Summary */}
        <h1 className="mt-8 text-xl font-bold text-pink-400">SUMMARY</h1>
        <p className="pl-4 mt-4 text-lg italic text-gray-300 border-l-4 border-pink-400">
          {writeup.summary}
        </p>

        {/* Full Description */}
        <h1 className="mt-10 text-xl font-bold text-pink-400">WRITEUP</h1>
        <div
          className="mt-4 text-xl leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processDescription(writeup.description)) }}
        ></div>

        {/* Like Section at the Bottom */}
        <div className="flex items-center justify-end gap-6 pt-4 mt-8 border-t border-gray-700">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-2xl transition hover:text-red-500"
          >
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
            <span>{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteupDetails;
