import { NodeTypeKey } from "../nodes/NodeTypes";

export const generateWorkflowId = (): string => {
  return `wf_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

export const generateNodeId = (type: NodeTypeKey | string): string => {
  return `${type}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 6)}`;
};

export default generateWorkflowId;
