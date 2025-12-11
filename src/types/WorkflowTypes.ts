import { Node, Edge } from 'reactflow';
import { NodeConfig } from './NodeConfigTypes';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node<NodeConfig>[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowMetadata {
  id: string;
  name: string;
  description?: string;
  nodeCount: number;
  edgeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowState {
  currentWorkflow: Workflow | null;
  workflows: WorkflowMetadata[];
  isLoading: boolean;
  error: string | null;
}
