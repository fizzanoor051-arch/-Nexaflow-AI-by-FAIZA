import type { Workflow } from "@/types/workflow";

const initialWorkflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "Customer Support Automation",
    description:
      "Automatically analyze and respond to customer inquiries.",
    status: "active",
    runs: 248,
    successRate: 96,
    steps: [
  {
    id: "step-1",
    title: "Receive inquiry",
    description: "Capture customer message.",
    type: "trigger",
    order: 1,
  },
  {
    id: "step-2",
    title: "Analyze intent",
    description: "AI classifies the request.",
    type: "ai",
    order: 2,
  },
  {
    id: "step-3",
    title: "Generate response",
    description: "AI creates the response.",
    type: "ai",
    order: 3,
  },
],
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type WorkflowStore = {
  workflows: Workflow[];
};

const globalForWorkflows = globalThis as typeof globalThis & {
  __nexaFlowWorkflowStore?: WorkflowStore;
};

if (!globalForWorkflows.__nexaFlowWorkflowStore) {
  globalForWorkflows.__nexaFlowWorkflowStore = {
    workflows: initialWorkflows,
  };
}

export const workflowStore =
  globalForWorkflows.__nexaFlowWorkflowStore;

export function getWorkflowById(id: string) {
  return workflowStore.workflows.find(
    (workflow) => workflow.id === id
  );
}

export function createWorkflow(workflow: Workflow) {
  workflowStore.workflows.unshift(workflow);

  return workflow;
}

export function updateWorkflow(
  id: string,
  updates: Partial<Workflow>
) {
  const index = workflowStore.workflows.findIndex(
    (workflow) => workflow.id === id
  );

  if (index === -1) {
    return null;
  }

  const updatedWorkflow: Workflow = {
    ...workflowStore.workflows[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  workflowStore.workflows[index] = updatedWorkflow;

  return updatedWorkflow;
}

export function deleteWorkflow(id: string) {
  const index = workflowStore.workflows.findIndex(
    (workflow) => workflow.id === id
  );

  if (index === -1) {
    return false;
  }

  workflowStore.workflows.splice(index, 1);

  return true;
}