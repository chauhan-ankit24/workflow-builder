import React from "react";
import type { Node } from "reactflow";
import type { NodeConfig } from "../types";
import SendMessageFields from "./fields/SendMessageFields";
import ConditionFields from "./fields/ConditionFields";
import FollowUserFields from "./fields/FollowUserFields";
import WaitTimerFields from "./fields/WaitTimerFields";
import { useFlowStore } from "../store/useFlowStore";

const ConfigurationPanel: React.FC = () => {
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Configuration
        </h2>
        <p className="text-gray-500">Click on a node to configure it.</p>
      </div>
    );
  }

  const renderFields = () => {
    switch (selectedNode.type) {
      case "sendMessage":
        return (
          <SendMessageFields
            node={
              selectedNode as Node<Extract<NodeConfig, { type: "sendMessage" }>>
            }
            onUpdate={updateNodeData}
          />
        );
      case "condition":
        return (
          <ConditionFields
            node={
              selectedNode as Node<Extract<NodeConfig, { type: "condition" }>>
            }
            onUpdate={updateNodeData}
          />
        );
      case "followUser":
        return (
          <FollowUserFields
            node={
              selectedNode as Node<Extract<NodeConfig, { type: "followUser" }>>
            }
            onUpdate={updateNodeData}
          />
        );
      case "waitTimer":
        return (
          <WaitTimerFields
            node={
              selectedNode as Node<Extract<NodeConfig, { type: "waitTimer" }>>
            }
            onUpdate={updateNodeData}
          />
        );
      default:
        return (
          <p className="text-gray-500">
            No configuration available for this node type.
          </p>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Configure {selectedNode.data.label}
      </h2>
      {renderFields()}
    </div>
  );
};

export default ConfigurationPanel;
