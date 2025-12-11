import type { Workflow } from '../types';

const WORKFLOWS_KEY = 'workflow-builder-workflows';

export const saveWorkflowsToStorage = (workflows: Workflow[]): void => {
  try {
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
  } catch (error) {
    console.error('Failed to save workflows to localStorage:', error);
  }
};

export const loadWorkflowsFromStorage = (): Workflow[] => {
  try {
    const stored = localStorage.getItem(WORKFLOWS_KEY);
    if (!stored) return [];
    type StoredWorkflow = Omit<Workflow, 'createdAt' | 'updatedAt'> & {
      createdAt: string;
      updatedAt: string;
    };

    const parsed = JSON.parse(stored) as StoredWorkflow[];
    return parsed.map((workflow) => ({
      ...workflow,
      createdAt: new Date(workflow.createdAt),
      updatedAt: new Date(workflow.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load workflows from localStorage:', error);
    return [];
  }
};

export const saveWorkflowToStorage = (workflow: Workflow): void => {
  const workflows = loadWorkflowsFromStorage();
  const existingIndex = workflows.findIndex(w => w.id === workflow.id);
  if (existingIndex >= 0) {
    workflows[existingIndex] = workflow;
  } else {
    workflows.push(workflow);
  }
  saveWorkflowsToStorage(workflows);
};

export const deleteWorkflowFromStorage = (workflowId: string): void => {
  const workflows = loadWorkflowsFromStorage();
  const filtered = workflows.filter(w => w.id !== workflowId);
  saveWorkflowsToStorage(filtered);
};
