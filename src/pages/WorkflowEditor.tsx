import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../panels/Sidebar";
import WorkflowCanvas from "../workflow/WorkflowCanvas";
import ConfigurationPanel from "../panels/ConfigurationPanel";
import { useFlowStore } from "../store/useFlowStore";

const WorkflowEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onConnect,
    workflowName,
    workflowDescription,
    setCurrentWorkflow,
    saveWorkflow,
  } = useFlowStore();

  useEffect(() => {
    if (id) {
      setCurrentWorkflow(id);
    }
  }, [id, setCurrentWorkflow]);

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {workflowName || `Workflow ${id}`}
            </h1>
            {workflowDescription && (
              <p className="text-gray-600 mt-1">{workflowDescription}</p>
            )}
          </div>
          <button
            onClick={saveWorkflow}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Save Workflow
          </button>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={setNodes}
              onEdgesChange={setEdges}
              onConnect={onConnect}
            />
          </div>
          <ConfigurationPanel />
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
