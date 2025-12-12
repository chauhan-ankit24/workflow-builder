import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
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

import type {
  NodeConfig,
  Workflow,
  WorkflowMetadata,
  ConnectionValidation,
} from "../types";
import {
  saveWorkflowToStorage,
  loadWorkflowsFromStorage,
  deleteWorkflowFromStorage,
} from "../utils/localStorage";
import { validateConnections } from "../workflow/validation/validateConnections";
import { showErrorToast, showSuccessToast } from "../utils/toast";


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
  
  nodes: RFNode<NodeConfig>[];
  edges: RFEdge[];
  setNodes: OnNodesChange;
  setEdges: OnEdgesChange;
  onConnect: OnConnect;

  
  past: { nodes: RFNode<NodeConfig>[]; edges: RFEdge[] }[];
  future: { nodes: RFNode<NodeConfig>[]; edges: RFEdge[] }[];
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  
  saveHistory: () => void;

  
  workflows: WorkflowMetadata[];
  currentWorkflow: Workflow | null;
  workflowName?: string;
  workflowDescription?: string;

  
  loadWorkflows: () => void;
  createWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (workflowId: string) => void;
  setCurrentWorkflow: (workflowId: string) => void;
  buildWorkflow: (workflowId: string) => ConnectionValidation[];
  saveCurrentWorkflow: () => void;

  
  addNode: (node: RFNode<NodeConfig>) => void;
  deleteNode: (nodeId: string) => void;
  editNode: (nodeId: string) => void;
  saveWorkflow: () => boolean;

  
  selectedNode: RFNode<NodeConfig> | null;
  setSelectedNode: (node: RFNode<NodeConfig> | null) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
};

export const useFlowStore = create<FlowStoreState>()(
  immer((set, get) => ({
    
    nodes: [],
    edges: [],

    
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    setNodes: (changes) => {
      set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) }));
      
      const hasNonPositionChanges = changes.some(change => change.type !== 'position');
      if (hasNonPositionChanges) {
        get().saveHistory();
      }
      
      setTimeout(() => get().saveCurrentWorkflow(), 0);
    },

    setEdges: (changes) => {
      set((s) => ({ edges: applyEdgeChanges(changes, s.edges) }));
      get().saveHistory();
      
      setTimeout(() => get().saveCurrentWorkflow(), 0);
    },

    onConnect: (connection) => {
      set((s) => {
        let newEdges = s.edges;

        
        newEdges = newEdges.filter((edge) => edge.source !== connection.source);

        
        newEdges = newEdges.filter((edge) => edge.target !== connection.target);

        
        newEdges = addEdge(connection, newEdges);

        return { edges: newEdges };
      });
      get().saveHistory();
      
      setTimeout(() => get().saveCurrentWorkflow(), 0);
    },

    
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
      set((s) => ({
        workflows: s.workflows.filter((w) => w.id !== workflowId),
      }));
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

      
      if (node.type === "start") {
        const existingStartNode = state.nodes.find((n) => n.type === "start");
        if (existingStartNode) {
          showErrorToast("Workflow can only have one start node");
          return; 
        }
      }

      set((s) => ({ nodes: [...s.nodes, node] }));
      
      setTimeout(() => get().saveCurrentWorkflow(), 0);
    },

    deleteNode: (nodeId) => {
      console.log(`Deleting node: ${nodeId}`);
      const state = get();
      const newNodes = state.nodes.filter((node) => node.id !== nodeId);
      const newEdges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      set(() => ({
        nodes: newNodes,
        edges: newEdges,
      }));
      
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

      
      const validations = validateConnections(state.nodes, state.edges);
      const hasErrors = validations.some((v) => !v.isValid);

      if (hasErrors) {
        
        const firstError = validations.find((v) => !v.isValid);
        if (firstError?.error) {
          showErrorToast(firstError.error);
        }
        return false; 
      }

      
      get().saveCurrentWorkflow();
      showSuccessToast("Workflow saved successfully!");
      return true; 
    },

    selectedNode: null,
    setSelectedNode: (node) => set(() => ({ selectedNode: node })),
    updateNodeData: (nodeId, data) => {
      set((s) => ({
        nodes: s.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        ),
      }));
      get().saveHistory();
      setTimeout(() => get().saveCurrentWorkflow(), 0);
    },

    saveHistory: () => {
      const state = get();
      set({
        past: [...state.past, { nodes: state.nodes, edges: state.edges }],
        future: [],
        canUndo: true,
        canRedo: false,
      });
    },

    undo: () => {
      const state = get();
      if (state.past.length > 0) {
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);
        set({
          past: newPast,
          future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
          nodes: previous.nodes,
          edges: previous.edges,
          canUndo: newPast.length > 0,
          canRedo: true,
        });
      }
    },

    redo: () => {
      const state = get();
      if (state.future.length > 0) {
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        set({
          past: [...state.past, { nodes: state.nodes, edges: state.edges }],
          future: newFuture,
          nodes: next.nodes,
          edges: next.edges,
          canUndo: true,
          canRedo: newFuture.length > 0,
        });
      }
    },
  }))
);

export default useFlowStore;
