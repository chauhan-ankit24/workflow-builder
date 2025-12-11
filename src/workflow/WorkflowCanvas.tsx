import React, { useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

// Import node components
import StartNode from "../nodes/StartNode";
import ConditionNode from "../nodes/ConditionNode";
import SendMessageNode from "../nodes/SendMessageNode";
import FollowUserNode from "../nodes/FollowUserNode";
import WaitTimerNode from "../nodes/WaitTimerNode";
import { useFlowStore } from "../store/useFlowStore";
import { generateNodeId } from "../utils/idGenerator";
import { NODE_TYPES, NodeType as NodeTypeObj } from "../nodes";

// Type for node data config
type NodeDataConfig =
  | { condition: string }
  | { recipient: string; message: string }
  | { username: string }
  | { hours: number; minutes: number }
  | Record<string, never>;

// Node types registry mapping type strings to React components
const nodeTypesRegistry = {
  start: StartNode,
  condition: ConditionNode,
  sendMessage: SendMessageNode,
  followUser: FollowUserNode,
  waitTimer: WaitTimerNode,
};

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const editNode = useFlowStore((state) => state.editNode);
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const addNode = useFlowStore((state) => state.addNode);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Add delete and edit functions to each node's data
  const nodesWithActions = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      id: node.id,
      onDelete: deleteNode,
      onEdit: editNode,
    },
  }));

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    const nodeType = event.dataTransfer.getData("application/reactflow");

    if (typeof nodeType === "undefined" || !nodeType || !reactFlowBounds) {
      return;
    }

    const position = reactFlowInstance.current?.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    if (!position) return;

    const id = generateNodeId(nodeType);
    const data: { label: string; config?: NodeDataConfig } = {
      label: NODE_TYPES[nodeType as keyof typeof NODE_TYPES],
    };

    switch (nodeType) {
      case NodeTypeObj.CONDITION:
        data.config = {
          condition: "true",
        };
        break;

      case NodeTypeObj.SEND_MESSAGE:
        data.config = {
          recipient: "@user",
          message: "Hello!",
        };
        break;

      case NodeTypeObj.FOLLOW_USER:
        data.config = {
          username: "username",
        };
        break;

      case NodeTypeObj.WAIT_TIMER:
        data.config = {
          hours: 0,
          minutes: 5,
        };
        break;

      case NodeTypeObj.START:
      default:
        data.config = {};
        break;
    }

    const newNode: Node = {
      id,
      type: nodeType,
      position,
      data,
    };

    addNode(newNode);
  };

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodesWithActions}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypesRegistry}
        fitView
        attributionPosition="top-right"
        onInit={(instance) => (reactFlowInstance.current = instance)}
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
