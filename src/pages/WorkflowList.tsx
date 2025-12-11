import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../store/useFlowStore";
import {
  showInfoToast,
  // showErrorToast,
  // showSuccessToast,
} from "../utils/toast";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodeCount: number;
  edgeCount: number;
  updatedAt: Date;
}

const WorkflowList: React.FC = () => {
  const navigate = useNavigate();
  const {
    workflows,
    loadWorkflows,
    deleteWorkflow,
    setCurrentWorkflow,
    // buildWorkflow,
  } = useFlowStore();

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const handleEdit = (workflowId: string) => {
    setCurrentWorkflow(workflowId);
    navigate(`/editor/${workflowId}`);
    showInfoToast("Navigating to workflow editor...");
  };

  const handleDelete = (workflowId: string) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      deleteWorkflow(workflowId);
      showInfoToast("Workflow deleted");
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>

          <button
            onClick={() => {
              showInfoToast("Creating new workflow...");
              setTimeout(() => {
                navigate("/create");
              }, 1000);
            }}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white px-4 py-2 rounded-lg transition-all"
          >
            Create Workflow
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {workflows.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-600 text-xl font-medium">
                No workflows yet
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Create your first workflow to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {workflows.map((workflow: Workflow) => (
                <div
                  key={workflow.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow transition-all duration-200 flex flex-col"
                >
                  {/* Content Wrapper (fixed height area) */}
                  <div className="flex-1 min-h-[100px] flex flex-col">
                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 mb-1 w-full truncate">
                      {workflow.name}
                    </h3>

                    {/* Description */}
                    {workflow.description ? (
                      <p className="text-gray-500 text-xs mb-3 w-full line-clamp-2 overflow-hidden text-ellipsis">
                        {workflow.description}
                      </p>
                    ) : (
                      // Empty placeholder to maintain height
                      <div className="h-6 mb-3"></div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between text-[11px] text-gray-500 mb-2 w-full">
                      <span className="truncate w-1/2 text-left">
                        {workflow.nodeCount} nodes
                      </span>
                      <span className="truncate w-1/2 text-right">
                        {workflow.edgeCount} connections
                      </span>
                    </div>

                    {/* Last updated */}
                    <div className="text-right text-[10px] text-gray-400 mb-3 w-full truncate">
                      Updated {workflow.updatedAt.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Buttons (always bottom aligned) */}
                  <div className="grid grid-cols-2 gap-2 w-full mt-auto">
                    <button
                      onClick={() => handleEdit(workflow.id)}
                      className="cursor-pointer w-full bg-blue-600 text-white py-1.5 rounded-md text-xs hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="cursor-pointer w-full bg-red-600 text-white py-1.5 rounded-md text-xs hover:bg-red-700 active:scale-95 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkflowList;
