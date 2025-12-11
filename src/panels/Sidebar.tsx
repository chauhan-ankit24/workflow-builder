import React from "react";
// import { Node } from "reactflow";
import { NODE_TYPES, NodeType as NodeTypeObj } from "../nodes";
// import { useFlowStore } from "../store/useFlowStore";
// import { generateNodeId } from "../utils/idGenerator";
import type {
  // NodeConfig,
  ConditionNodeConfig,
  SendMessageNodeConfig,
  FollowUserNodeConfig,
  WaitTimerNodeConfig,
} from "../types";

/**
 * Derive runtime value type from NodeType object:
 * (typeof NodeTypeObj)[keyof typeof NodeTypeObj] => union of value strings
 */
type NodeTypeValue = (typeof NodeTypeObj)[keyof typeof NodeTypeObj];

export type NodeConfigUnion =
  | ConditionNodeConfig
  | SendMessageNodeConfig
  | FollowUserNodeConfig
  | WaitTimerNodeConfig
  | Record<string, never>; // for START node (empty config)

// const getRandomPosition = () => ({
//   x: Math.round(Math.random() * 500),
//   y: Math.round(Math.random() * 400),
// });

const Sidebar: React.FC = () => {
  // const addNode = useFlowStore((s) => s.addNode);

  // drag payload is the node type string (value), e.g. 'sendMessage'
  const onDragStart = (event: React.DragEvent, nodeType: NodeTypeValue) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // const handleAddNode = (nodeType: NodeTypeValue) => {
  //   const id = generateNodeId(nodeType);
  //   const position = getRandomPosition();

  //   // prepare node data (data contains label and a config object)
  //   const data: { label: string; config?: NodeConfigUnion } = {
  //     label: NODE_TYPES[nodeType],
  //   };

  //   switch (nodeType) {
  //     case NodeTypeObj.CONDITION:
  //       data.config = {
  //         condition: "true",
  //       } as ConditionNodeConfig;
  //       break;

  //     case NodeTypeObj.SEND_MESSAGE:
  //       data.config = {
  //         recipient: "@user",
  //         message: "Hello!",
  //       } as SendMessageNodeConfig;
  //       break;

  //     case NodeTypeObj.FOLLOW_USER:
  //       data.config = {
  //         username: "username",
  //       } as FollowUserNodeConfig;
  //       break;

  //     case NodeTypeObj.WAIT_TIMER:
  //       data.config = {
  //         hours: 0,
  //         minutes: 5,
  //       } as WaitTimerNodeConfig;
  //       break;

  //     case NodeTypeObj.START:
  //     default:
  //       data.config = {};
  //       break;
  //   }

  //   // Construct a React Flow Node
  //   const node: Node = {
  //     id,
  //     type: nodeType, // this should match registered node types in React Flow
  //     position,
  //     data,
  //   };

  //   addNode(node);
  // };

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-300">
      <h2 className="text-lg font-semibold mb-4">Node Palette</h2>
      <div className="space-y-2">
        {(Object.keys(NODE_TYPES) as Array<keyof typeof NODE_TYPES>).map(
          (key) => {
            // NODE_TYPES keys are the runtime values (same as NodeType values)
            const type = key as NodeTypeValue;
            const label = NODE_TYPES[type];

            return (
              <div
                key={type}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                draggable
                onDragStart={(event) => onDragStart(event, type)}
                // onClick={() => handleAddNode(type)}
              >
                <span className="text-sm font-medium">{label}</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">+</span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Sidebar;
