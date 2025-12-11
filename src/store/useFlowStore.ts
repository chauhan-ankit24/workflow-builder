import { create } from "zustand";
import {
  Node as RFNode,
  Edge as RFEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";

import type { NodeConfig, Workflow, WorkflowMetadata, ConnectionValidation } from "../types";
import {
  saveWorkflowToStorage,
  loadWorkflowsFromStorage,
  deleteWorkflowFromStorage,
} from "../utils/localStorage";
import { validateConnections } from "../workflow/validation/validateConnections";
import { showErrorToast } from "../utils/toast";

/* Local types used by the store (kept here for clarity) */
export type NodeItem = {
  id: string;
  type?: string;
  data?: Record<string, unknown>;
  position?: { x: number; y: number };
};

export type EdgeItem = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type WorkflowItem = {
  id: string;
  name: string;
  description?: string;
  nodes: NodeItem[];
  edges: EdgeItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type FlowStoreState = {
  // Editor
  nodes: RFNode<NodeConfig>[];
  edges: RFEdge[];
  setNodes: OnNodesChange;
  setEdges: OnEdgesChange;
  onConnect: OnConnect;

  // Workflows (metadata + current)
  workflows: WorkflowMetadata[];
  currentWorkflow: Workflow | null;
  workflowName?: string;
  workflowDescription?: string;

  // Actions
  loadWorkflows: () => void;
  createWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (workflowId: string) => void;
  setCurrentWorkflow: (workflowId: string) => void;
  buildWorkflow: (workflowId: string) => ConnectionValidation[];
  saveCurrentWorkflow: () => void;

  // Node actions
  addNode: (node: RFNode<NodeConfig>) => void;
  deleteNode: (nodeId: string) => void;
  editNode: (nodeId: string) => void;
  saveWorkflow: () => boolean;

  // Configuration panel
  selectedNode: RFNode<NodeConfig> | null;
  setSelectedNode: (node: RFNode<NodeConfig> | null) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
};

export const useFlowStore = create<FlowStoreState>((set, get) => ({
  // Editor state
  nodes: [],
  edges: [],

  setNodes: (changes) => {
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) }));
    // Auto-save after node changes
    setTimeout(() => get().saveCurrentWorkflow(), 0);
  },

  setEdges: (changes) => {
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) }));
    // Auto-save after edge changes
    setTimeout(() => get().saveCurrentWorkflow(), 0);
  },

  onConnect: (connection) => {
    set((s) => {
      let newEdges = s.edges;

      // Remove existing outgoing edge from source node
      newEdges = newEdges.filter(edge => edge.source !== connection.source);

      // Remove existing incoming edge to target node
      newEdges = newEdges.filter(edge => edge.target !== connection.target);

      // Add the new edge
      newEdges = addEdge(connection, newEdges);

      return { edges: newEdges };
    });
    // Auto-save after connection changes
    setTimeout(() => get().saveCurrentWorkflow(), 0);
  },

  // Workflows
  workflows: [],
  currentWorkflow: null,
  workflowName: undefined,
  workflowDescription: undefined,

  loadWorkflows: () => {
    const all = loadWorkflowsFromStorage();
    const metadata: WorkflowMetadata[] = all.map((w) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      nodeCount: w.nodes?.length ?? 0,
      edgeCount: w.edges?.length ?? 0,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));
    set(() => ({ workflows: metadata }));
  },

  createWorkflow: (workflow) => {
    saveWorkflowToStorage(workflow);
    set((s) => ({
      workflows: [
        ...s.workflows,
        {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          nodeCount: workflow.nodes?.length ?? 0,
          edgeCount: workflow.edges?.length ?? 0,
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
        },
      ],
      currentWorkflow: workflow,
      nodes: workflow.nodes ?? [],
      edges: workflow.edges ?? [],
      workflowName: workflow.name,
      workflowDescription: workflow.description,
    }));
  },

  deleteWorkflow: (workflowId) => {
    deleteWorkflowFromStorage(workflowId);
    set((s) => ({ workflows: s.workflows.filter((w) => w.id !== workflowId) }));
    if (get().currentWorkflow?.id === workflowId) {
      set(() => ({
        currentWorkflow: null,
        nodes: [],
        edges: [],
        workflowName: undefined,
        workflowDescription: undefined,
      }));
    }
  },

  setCurrentWorkflow: (workflowId) => {
    const all = loadWorkflowsFromStorage();
    const found = all.find((w) => w.id === workflowId) || null;
    if (found) {
      set(() => ({
        currentWorkflow: found,
        nodes: found.nodes ?? [],
        edges: found.edges ?? [],
        workflowName: found.name,
        workflowDescription: found.description,
      }));
    }
  },

  buildWorkflow: (workflowId) => {
    const all = loadWorkflowsFromStorage();
    const found = all.find((w) => w.id === workflowId);
    if (found) {
      return validateConnections(found.nodes ?? [], found.edges ?? []);
    }
    return [];
  },

  saveCurrentWorkflow: () => {
    const state = get();
    if (state.currentWorkflow) {
      const updatedWorkflow: Workflow = {
        ...state.currentWorkflow,
        nodes: state.nodes,
        edges: state.edges,
        updatedAt: new Date(),
      };
      saveWorkflowToStorage(updatedWorkflow);
      // Update the workflow metadata in the list
      set((s) => ({
        workflows: s.workflows.map((w) =>
          w.id === updatedWorkflow.id
            ? {
                ...w,
                nodeCount: updatedWorkflow.nodes?.length ?? 0,
                edgeCount: updatedWorkflow.edges?.length ?? 0,
                updatedAt: updatedWorkflow.updatedAt,
              }
            : w
        ),
        currentWorkflow: updatedWorkflow,
      }));
    }
  },

  addNode: (node) => {
    const state = get();

    // Prevent adding a second start node
    if (node.type === 'start') {
      const existingStartNode = state.nodes.find(n => n.type === 'start');
      if (existingStartNode) {
        showErrorToast('Workflow can only have one start node');
        return; // Don't add the node
      }
    }

    set((s) => ({ nodes: [...s.nodes, node] }));
    // Auto-save after adding node
    setTimeout(() => get().saveCurrentWorkflow(), 0);
  },

  deleteNode: (nodeId) => {
    console.log(`Deleting node: ${nodeId}`);
    const state = get();
    const newNodes = state.nodes.filter((node) => node.id !== nodeId);
    const newEdges = state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);

    // Validate the workflow after deletion
    const validations = validateConnections(newNodes, newEdges);
    const hasErrors = validations.some(v => !v.isValid);

    if (hasErrors) {
      // Show error toast for the first validation error
      const firstError = validations.find(v => !v.isValid);
      if (firstError?.error) {
        showErrorToast(firstError.error);
      }
      return; // Don't delete the node
    }

    // If valid, proceed with deletion
    set(() => ({
      nodes: newNodes,
      edges: newEdges,
    }));
    // Auto-save after deleting node
    setTimeout(() => get().saveCurrentWorkflow(), 0);
  },

  editNode: (nodeId) => {
    const state = get();
    const node = state.nodes.find((n) => n.id === nodeId);
    if (node) {
      set(() => ({ selectedNode: node }));
    }
  },

  saveWorkflow: () => {
    const state = get();

    // Validate the workflow before saving
    const validations = validateConnections(state.nodes, state.edges);
    const hasErrors = validations.some(v => !v.isValid);

    if (hasErrors) {
      // Show error toast for the first validation error
      const firstError = validations.find(v => !v.isValid);
      if (firstError?.error) {
        showErrorToast(firstError.error);
      }
      return false; // Indicate save failed
    }

    // If valid, proceed with saving
    get().saveCurrentWorkflow();
    return true; // Indicate save succeeded
  },

  selectedNode: null,
  setSelectedNode: (node) => set(() => ({ selectedNode: node })),
  updateNodeData: (nodeId, data) => {
    set((s) => ({
      nodes: s.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    }));
    setTimeout(() => get().saveCurrentWorkflow(), 0);
  },
}));

export default useFlowStore;
