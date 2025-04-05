import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import {
  EditorComposer,
  Editor,
  ToolbarPlugin,
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
  Divider,
} from "verbum";

const CreateWriteup = () => {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState(""); // User will enter their name manually
  const [searchParams] = useSearchParams(); // Use URL params
  const [challengeTitle, setChallengeTitle] = useState("");
  const [category, setCategory] = useState("");

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
  
      // Configure axios for large payloads
      const config = {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json',
        }
      };
  
      const response = await axios.post(
        "http://localhost:5000/api/writeups",
        payload,
        config
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
      {/* Toast Container */}
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

        {/* Author Input */}
        <h2 className="mt-6 mb-3 ml-20 text-2xl font-bold">Your Name</h2>
        <input
          type="text"
          className="w-[990px] ml-20 p-2 rounded-md text-black text-sm"
          placeholder="Enter your name..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        {/* Summary Input */}
        <h2 className="mt-6 mb-3 ml-20 text-2xl font-bold">Summarize Your Writeup</h2>
        <textarea
          className="w-[990px] ml-20 p-2 rounded-md text-black text-sm resize-y"
          placeholder="Write a brief summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {/* Description Editor */}
        <h2 className="mt-6 mb-3 ml-20 text-2xl font-bold">Writeup Content</h2>
        <EditorComposer>
          <Editor
            placeholder="Start writing your writeup here..."
            hashtagsEnabled={true}
            className="min-h-[400px] p-4 text-white bg-gray-800 rounded-lg shadow-md"
            onChange={() => {
              const content = document.querySelector('[data-lexical-editor]').innerHTML;
              setDescription(content);
            }}
          >
            <ToolbarPlugin className="flex p-2 overflow-x-auto bg-gray-700 border-b border-gray-600 flex-nowrap">
              <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
                <FontFamilyDropdown className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <FontSizeDropdown className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <Divider className="bg-gray-600" />
                <BoldButton className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <ItalicButton className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <UnderlineButton className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <CodeFormatButton className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <InsertLinkButton className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <TextColorPicker className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <BackgroundColorPicker className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <TextFormatDropdown className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <Divider className="bg-gray-600" />
                <InsertDropdown  enablePoll={true} className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
                <AlignDropdown className="p-1 text-white bg-gray-600 rounded-md hover:bg-gray-500" />
              </div>
            </ToolbarPlugin>
          </Editor>
        </EditorComposer>

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