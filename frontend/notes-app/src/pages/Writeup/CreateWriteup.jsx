import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";

const CreateWriteup = () => {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [searchParams] = useSearchParams();
  const [challengeTitle, setChallengeTitle] = useState("");
  const [category, setCategory] = useState("");
  const editor = useRef(null);

  // Jodit editor configuration
  const editorConfig = {
    uploader: {
      insertImageAsBase64URI: true,
    },
    buttons: [
      'bold', 'italic', 'underline', '|', 
      'ul', 'ol', '|', 
      'image', 'link', '|', 
      'undo', 'redo'
    ],
    height: 400,
    width: '100%',
    readonly: false,
    toolbarAdaptive: false,
    theme: 'dark'
  };

  // Extract title & category from the URL
  useEffect(() => {
    setChallengeTitle(searchParams.get("challenge") || "Untitled Challenge");
    setCategory(searchParams.get("category") || "General");
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!author.trim()) {
      toast.error("Please enter your name.");
      return;
    }
  
    try {
      const payload = {
        summary,
        description,
        author,
        category,
        date: new Date(),
        title: challengeTitle,
      };
  
      const response = await axios.post(
        "https://phreaks-ctf.onrender.com/api/writeups",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      if (response.status === 201) {
        toast.success("Writeup submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting writeup:", error);
      toast.error(error.response?.data?.message || "Failed to submit writeup.");
    }
  };

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center md:text-6xl">{challengeTitle}</h1>
        <h3 className="text-center text-pink-400">{category}</h3>

        {/* Summary Input */}
        <h2 className="mt-6 mb-3 ml-20 text-2xl font-bold">Summarize Your Writeup</h2>
        <textarea
          className="w-[990px] ml-20 p-2 rounded-md text-black text-sm resize-y"
          placeholder="Write a brief summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {/* Description Editor - Now using Jodit */}
        <h2 className="mt-6 mb-3 ml-20 text-2xl font-bold">Writeup Content</h2>
        <div className="w-full max-w-4xl mt-10">
          <JoditEditor
            ref={editor}
            value={description}
            config={editorConfig}
            className="bg-white rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          className="px-6 py-2 mt-6 ml-20 text-white bg-pink-600 rounded-lg hover:bg-pink-700"
          onClick={handleSubmit}
        >
          Submit Writeup
        </button>
      </div>
    </div>
  );
};

export default CreateWriteup;