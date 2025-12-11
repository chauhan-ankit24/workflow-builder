import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlowStoreState, useFlowStore } from "../store/useFlowStore";
import { generateWorkflowId } from "../utils/idGenerator";

const CreateWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const createWorkflow = useFlowStore(
    (state: FlowStoreState) => state.createWorkflow
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const workflowId = generateWorkflowId();
    createWorkflow({
      id: workflowId,
      name: name.trim(),
      description: description.trim(),
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    navigate(`/editor/${workflowId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Workflow
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Workflow Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workflow name"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Write a short description (optional)"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 cursor-pointer px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 active:scale-95 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 cursor-pointer px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 transition-all disabled:opacity-50"
            >
              Create Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkflow;
