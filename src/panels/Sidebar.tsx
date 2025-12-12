import React from "react";
import { NODE_TYPES, NodeType as NodeTypeObj } from "../nodes";
import type {
  ConditionNodeConfig,
  SendMessageNodeConfig,
  FollowUserNodeConfig,
  WaitTimerNodeConfig,
} from "../types";

type NodeTypeValue = (typeof NodeTypeObj)[keyof typeof NodeTypeObj];

export type NodeConfigUnion =
  | ConditionNodeConfig
  | SendMessageNodeConfig
  | FollowUserNodeConfig
  | WaitTimerNodeConfig
  | Record<string, never>;

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeTypeValue) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Node Palette
      </h2>

      <div className="space-y-2">
        {(Object.keys(NODE_TYPES) as Array<keyof typeof NODE_TYPES>).map(
          (key) => {
            const type = key as NodeTypeValue;
            const label = NODE_TYPES[type];

            return (
              <div
                key={type}
                draggable
                onDragStart={(event) => onDragStart(event, type)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer
                           hover:bg-gray-100 active:scale-[0.97] transition-all text-sm font-medium
                           shadow-sm"
              >
                {label}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Sidebar;
