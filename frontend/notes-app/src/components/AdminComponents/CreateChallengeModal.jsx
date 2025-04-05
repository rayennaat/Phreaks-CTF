import { useState } from "react";

export default function CreateChallengeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-lg font-semibold">Options</h2>

        <label className="block text-sm font-medium">Flag:</label>
        <input
          type="text"
          className="w-full p-2 mt-1 border rounded"
          placeholder="Static flag for your challenge"
        />

        <label className="block mt-4 text-sm font-medium">Case Sensitivity:</label>
        <select className="w-full p-2 mt-1 border rounded">
          <option value="case-sensitive">Case Sensitive</option>
          <option value="case-insensitive">Case Insensitive</option>
        </select>

        <label className="block mt-4 text-sm font-medium">State:</label>
        <select className="w-full p-2 mt-1 border rounded">
          <option value="hidden">Hidden</option>
          <option value="visible">Visible</option>
        </select>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
