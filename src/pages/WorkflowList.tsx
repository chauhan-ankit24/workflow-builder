import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../store/useFlowStore";
import { showInfoToast } from "../utils/toast";

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
  const { workflows, loadWorkflows, deleteWorkflow, setCurrentWorkflow } =
    useFlowStore();

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
      {}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>

          <button
            onClick={() => {
              showInfoToast("Creating new workflow...");
              setTimeout(() => {
                navigate("/create");
              }, 600);
            }}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white px-4 py-2 rounded-lg transition-all"
          >
            Create Workflow
          </button>
        </div>
      </header>

      {}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
        <div className="max-w-6xl mx-auto">
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
            <div className="grid cursor-pointer grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow: Workflow) => (
                <div
                  key={workflow.id}
                  className="relative bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-between gap-4 h-20"
                >
                  {}
                  <div className="flex flex-col text-left justify-center min-w-0 flex-1 max-w-[calc(100%-88px)]">
                    <h3
                      className="text-base font-semibold text-gray-900 truncate leading-tight"
                      title={workflow.name}
                    >
                      {workflow.name}
                    </h3>
                    <p
                      className="text-gray-500 text-sm mt-1 truncate leading-tight"
                      title={workflow.description || "No description"}
                    >
                      {workflow.description || "\u00A0"}
                    </p>
                  </div>

                  {}
                  <div className="flex items-center gap-2 shrink-0 w-20">
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      aria-label={`Delete ${workflow.name}`}
                      title="Delete workflow"
                      className="p-2 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12M9 7v10a2 2 0 002 2h2a2 2 0 002-2V7M10 7V5a2 2 0 012-2h0a2 2 0 012 2v2"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleEdit(workflow.id)}
                      aria-label={`Open ${workflow.name}`}
                      title="Open editor"
                      className="p-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
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
