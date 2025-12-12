import type { Node, Edge } from "reactflow";
import type { ConnectionValidation } from "../../types";
import {
  detectCycles,
  findDisconnectedNodes,
} from "../../utils/graphAlgorithms";

export const validateConnections = (
  nodes: Node[],
  edges: Edge[]
): ConnectionValidation[] => {
  const validations: ConnectionValidation[] = [];

  
  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length === 0) {
    validations.push({
      sourceId: "",
      targetId: "",
      isValid: false,
      error: "Workflow must have exactly one start node",
      code: "NO_START_NODE",
    });
  } else if (startNodes.length > 1) {
    validations.push({
      sourceId: "",
      targetId: "",
      isValid: false,
      error: "Workflow can only have one start node",
      code: "MULTIPLE_START_NODES",
    });
  }

  
  if (detectCycles(edges)) {
    validations.push({
      sourceId: "",
      targetId: "",
      isValid: false,
      error: "Workflow cannot contain cycles or loops",
      code: "CYCLE_DETECTED",
    });
  }

  
  const disconnectedNodeIds = findDisconnectedNodes(nodes, edges);
  if (disconnectedNodeIds.length > 0) {
    validations.push({
      sourceId: "",
      targetId: "",
      isValid: false,
      error: "Workflow cannot have isolated nodes",
      code: "ISOLATED_NODES",
    });
  }

  
  const incomingEdges = new Map<string, Edge[]>();
  const outgoingEdges = new Map<string, Edge[]>();

  edges.forEach((edge) => {
    if (!incomingEdges.has(edge.target)) {
      incomingEdges.set(edge.target, []);
    }
    incomingEdges.get(edge.target)!.push(edge);

    if (!outgoingEdges.has(edge.source)) {
      outgoingEdges.set(edge.source, []);
    }
    outgoingEdges.get(edge.source)!.push(edge);
  });

  
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      validations.push({
        sourceId: edge.source,
        targetId: edge.target,
        isValid: false,
        error: "Source or target node not found",
        code: "NODE_NOT_FOUND",
      });
    }
  });

  
  nodes.forEach((node) => {
    const incomingCount = incomingEdges.get(node.id)?.length || 0;
    const outgoingCount = outgoingEdges.get(node.id)?.length || 0;

    if (node.type === "start") {
      if (incomingCount !== 0) {
        validations.push({
          sourceId: node.id,
          targetId: "",
          isValid: false,
          error: "Start node cannot have incoming connections",
          code: "START_INCOMING_CONNECTION",
        });
      }
      if (outgoingCount !== 1) {
        validations.push({
          sourceId: node.id,
          targetId: "",
          isValid: false,
          error: "Start node must have exactly one outgoing connection",
          code: "START_OUTGOING_COUNT",
        });
      }
    } else {
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
    }
  });

  return validations;
};
