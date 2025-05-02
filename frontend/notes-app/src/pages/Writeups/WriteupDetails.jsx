import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { FaHeart, FaRegHeart, FaUser, FaCalendarAlt } from "react-icons/fa";
import DOMPurify from "dompurify";

const WriteupDetails = () => {
  const { id } = useParams();
  const [writeup, setWriteup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchWriteup = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const writeupResponse = await axios.get(`https://phreaks-ctf.onrender.com/api/writeups/${id}`, { headers });
        setWriteup(writeupResponse.data);
        setLikesCount(writeupResponse.data.likes?.length || 0);

        if (token) {
          const userResponse = await axios.get('https://phreaks-ctf.onrender.com/get-user', {
            headers: { Authorization: `Bearer ${token}` },
            params: { _: Date.now() },
          });
          
          if (userResponse.data?.user) {
            setUserId(userResponse.data.user.id);
            if (writeupResponse.data.likes?.includes(userResponse.data.user.id)) {
              setLiked(true);
            }
          }
        }
      } catch (error) {
        toast.error("Failed to load writeup.");
      } finally {
        setLoading(false);
      }
    };

    fetchWriteup();
  }, [id, userId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You need to log in to like this writeup.");
        return;
      }
  
      const response = await axios.post(
        `https://phreaks-ctf.onrender.com/api/writeups/${id}/like`,
        {},
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src?.startsWith('/uploads')) {
        img.setAttribute('src', `https://phreaks-ctf.onrender.com${src}`);
      }
    });
    return doc.body.innerHTML;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Loading...
    </div>
  );

  if (!writeup) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Writeup not found.
    </div>
  );

  return (
    <div className="min-h-screen py-6 pl-10 pr-10 text-gray-100 bg-gray-900">
      <Toaster position="top-center" />
      <div className="max-w-6xl pt-10 mx-auto">
        {/* Title & Category */}
        <h1 className="mb-5 text-5xl font-bold text-cyan-400">{writeup.title}</h1>
        <span className="px-4 py-1 text-sm font-medium bg-gray-800 rounded-md text-cyan-300">
          {writeup.category}
        </span>

        {/* Author & Date */}
        <div className="flex items-center gap-3 mt-4 text-gray-400">
          <div className="flex items-center gap-1">
            <FaUser className="text-sm" />
            <span>{writeup.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-sm" />
            <span>{new Date(writeup.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-cyan-400">SUMMARY</h2>
          <p className="pl-4 mt-3 text-gray-300 border-l-2 border-cyan-500">
            {writeup.summary}
          </p>
        </div>

        {/* Full Description */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-cyan-400">WRITEUP</h2>
          <div
            className="mt-4 prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processDescription(writeup.description)) }}
          ></div>
        </div>

        {/* Like Section */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t border-gray-700">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 transition-all rounded-lg hover:bg-gray-800"
            aria-label={liked ? "Unlike this writeup" : "Like this writeup"}
          >
            {liked ? (
              <FaHeart className="text-xl text-red-500" />
            ) : (
              <FaRegHeart className="text-xl text-gray-400 hover:text-red-500" />
            )}
            <span className="font-medium text-gray-300">{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteupDetails;